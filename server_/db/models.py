from django.db import models


class SeaProperties(models.Model):
    date = models.DateField(
        verbose_name="Date",
        null=True
    )
    time = models.TimeField(
        verbose_name="Time",
        null=True
    )
    precip = models.FloatField(
        verbose_name="Precipitation",
        default=None
    )
    temp = models.FloatField(
        verbose_name="Temperature",
        default=None
    )
    rh = models.FloatField(
        verbose_name="RelativeHumidity",
        default=None
    )
    press = models.FloatField(
        verbose_name="pressure",
        default=None
    )
    wspd = models.FloatField(
        verbose_name="windSpeed",
        default=None
    )
    wdir = models.IntegerField(
        verbose_name="windDirection",
        default=None
    )
    gamma = models.IntegerField(
        verbose_name="Gamma",
        default=None
    )
    radon = models.FloatField(
        verbose_name="Radon",
        default=None
    )

    class Meta:
        verbose_name = 'Sea Properties',
        verbose_name_plural = 'Sea Properties'
        ordering = ['date', 'time', 'id']

    def __str__(self):
        return str(self.date) + ' ' + str(self.time)


class MyDataset(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='Name',
        null=False
    )

    description = models.CharField(
        max_length=255,
        verbose_name='Description',
        null=False
    )

    record = models.ManyToManyField(
        SeaProperties,
        verbose_name="SeaProperties",
    )

    class Meta:
        verbose_name = 'My Dataset',
        verbose_name_plural = 'My Datasets'
        ordering = ['name', 'id']


def __str__(self):
    return str(self.date) + ' ' + str(self.time)
