from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
from .models import *


class SeaPropertiesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SeaProperties
        fields = ['id', 'date', 'time', 'precip', 'temp', 'rh', 'press', 'wspd', 'wdir', 'gamma', 'radon']


class MyDatasetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MyDataset
        fields = ['name', 'record', 'id', 'description']


# ViewSets define the view behavior.
class SeaPropertiesViewSet(viewsets.ModelViewSet):
    queryset = SeaProperties.objects.all()
    serializer_class = SeaPropertiesSerializer


# ViewSets define the view behavior.
class MyDatasetViewSet(viewsets.ModelViewSet):
    queryset = MyDataset.objects.all()
    serializer_class = MyDatasetSerializer


# api/...
# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'seaproperties', SeaPropertiesViewSet)
router.register(r'mydataset', MyDatasetViewSet)
