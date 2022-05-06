from django.urls import path

from . import views

# db/....
urlpatterns = [
    path('', views.index),
    path('uploadfile', views.uploadFile, name='uploadFile'),
    path('mydataset', views.search, name='search'),
    path('mydataset/<int:datasetId>/addrecord', views.addRecordToDataset, name='addrecordtodataset'),
    path('mydataset/<int:datasetId>/records/<int:recordId>/edit', views.addRecordToDataset, name='editrecordtodataset'),
    path('mydataset/<int:datasetId>/deleterecord/<int:recordId>', views.deleteRecordFromDataset,
         name='deleterecordfromdataset'),
]
