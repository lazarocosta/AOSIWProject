from django.core.files.storage import FileSystemStorage
from django.db import transaction
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import *
from .serializers import MyDatasetSerializer
from rest_framework.request import Request


def index(request):
    return HttpResponse("home page")


# http://127.0.0.1:8000/db/uploadfile
@csrf_exempt
@transaction.atomic
def uploadFile(request):
    if request.method == 'POST':
        try:
            datasetPropertiesJson = request.POST.get('datasetProperties')
            datasetProperties = json.loads(datasetPropertiesJson)

            uploadFile = request.FILES['document']

            fs = FileSystemStorage()
            fs.save('files/' + uploadFile.name, uploadFile)
            load_txt_file('files/' + uploadFile.name, datasetProperties)
            fs.delete('files/' + uploadFile.name)
            return JsonResponse({'message': 'File added successfully'})
        except Exception as error:
            print(format(error))
            return JsonResponse({'message': format(error)}, status=500)


@transaction.atomic
def load_txt_file(path, datasetProperties):
    file1 = open(path, 'r')
    Lines = file1.readlines()
    datasetName = datasetProperties["name"]
    datasetDescription = datasetProperties["description"]
    checked = datasetProperties["checked"]
    if checked:
        # remove the header
        Lines.pop(0)

    myDataset = MyDataset(name=datasetName, description=datasetDescription)
    myDataset.save()

    for line in Lines:
        myArray = line.split()
        seaIntance = SeaProperties(date=myArray[0], time=myArray[1], precip=myArray[2], temp=myArray[3], rh=myArray[4],
                                   press=myArray[5],
                                   wspd=myArray[6], wdir=myArray[7], gamma=myArray[8], radon=myArray[9])
        seaIntance.save()
        myDataset.record.add(seaIntance)


@csrf_exempt
@transaction.atomic
def addRecordToDataset(request, datasetId, recordId=""):
    if request.method == 'POST' or request.method == 'PUT':
        body = json.loads(request.body)
        try:
            myDataset = MyDataset.objects.get(id=datasetId)

            date = body["date"]
            time = body["time"]
            precip = body["precip"]
            temp = body["temp"]
            rh = body["rh"]
            press = body["press"]
            wspd = body["wspd"]
            wdir = body["wdir"]
            gamma = body["gamma"]
            radon = body["radon"]

            if request.method == 'PUT':
                SeaProperties.objects.filter(id=recordId).update(date=date, time=time, precip=precip, temp=temp, rh=rh,
                                                                 press=press,
                                                                 wspd=wspd, wdir=wdir, gamma=gamma, radon=radon)
                return JsonResponse({'message': 'Record updated successfully'})

            else:
                seaIntance = SeaProperties(date=date, time=time, precip=precip, temp=temp, rh=rh,
                                           press=press,
                                           wspd=wspd, wdir=wdir, gamma=gamma, radon=radon)
                seaIntance.save()
                myDataset.record.add(seaIntance)
                return JsonResponse({'message': 'Record added successfully'})
        except Exception as error:
            print(format(error))
            return JsonResponse({'message': format(error)}, status=500)


@csrf_exempt
@transaction.atomic
def deleteRecordFromDataset(request, datasetId, recordId):
    if request.method == 'DELETE':
        try:
            myDataset = MyDataset.objects.get(id=datasetId)
            seaIntance = SeaProperties.objects.get(id=recordId)

            if myDataset.record.filter(id=recordId).count() >= 1:
                myDataset.record.remove(seaIntance)

                myDataset.save()
                return JsonResponse({'message': 'Record deleted successfully'})
            return JsonResponse({'message': 'There isn\'t that relationship'})
        except Exception as error:
            print(format(error))
            return JsonResponse({'message': format(error)}, status=500)


@csrf_exempt
@transaction.atomic
def search(request):
    if request.method == 'GET':
        serializer_context = {
            'request': Request(request),
        }
        records = []
        datasetName = request.GET.get('search', '')
        setQuery = MyDataset.objects.filter(name__contains=datasetName)
        setQuery2 = MyDataset.objects.filter(description__contains=datasetName)

        for element in setQuery:
            serializer = MyDatasetSerializer(element, context=serializer_context, many=False)
            records.append(serializer.data)

        for element in setQuery2:
            serializer = MyDatasetSerializer(element, context=serializer_context, many=False)
            record = serializer.data
            if record not in records:
                records.append(serializer.data)
        return JsonResponse(records, safe=False)
