from django.db import models

# Create your models here.
class Flight(models.Model):
    flight_number = models.CharField(max_length=16)
    origin = models.CharField(max_length=32)
    origin_code = models.CharField(max_length=4)
    destination = models.CharField(max_length=32)
    destination_code = models.CharField(max_length=4)
    
    date = models.DateField()
    duration = models.CharField(max_length=8)
    aircraft_type = models.CharField(max_length=8)
    cruising_altitude = models.CharField(max_length=5)
    distance = models.IntegerField()
    route = models.TextField()
    
    def __str__(self) -> str:
        return f"Flight {self.id}: {self.flight_number} from {self.origin_code} to {self.destination_code}"
    
    def serialize(self):
        return {
            "id": self.id,
            "flight_number": self.flight_number,
            "origin_code": self.origin_code,
            "destination_code": self.destination_code,
            "origin": self.origin,
            "destination": self.destination,
            "date": self.date,
            "duration": self.duration,
            "aircraft_type": self.aircraft_type,
            "cruising_altitude": self.cruising_altitude,
            "distance": self.distance,
            "route": self.route
        }