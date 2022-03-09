from django import forms
from .models import Flight

class FlightForm(forms.ModelForm):
    class Meta:
        model = Flight
        fields = [
            "flight_number",
            "origin",
            "origin_code",
            "destination",
            "destination_code",
            "date",
            "duration",
            "aircraft_type",
            "cruising_altitude",
            "distance",
            "route"
        ]
        widgets = {
            "date": forms.TextInput(attrs={"type": "date"})
        }