from django.db import models

# Create your models here.
class Flight(models.Model):
    flight_number = models.CharField(max_length=16)
    origin = models.CharField(max_length=32)
    origin_code = models.CharField(max_length=4)
    destination = models.CharField(max_length=32)
    destination_code = models.CharField(max_length=4)
    
    date = models.DateField()
    duration = models.TimeField()
    aircraft_type = models.CharField(max_length=8)
    cruising_altitude = models.CharField(max_length=5)
    distance = models.IntegerField()
    route = models.TextField()
    
