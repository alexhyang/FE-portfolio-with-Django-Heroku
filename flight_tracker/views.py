from webbrowser import get
from django.shortcuts import render
from django.http import JsonResponse
from .models import Flight
from django.shortcuts import get_list_or_404, redirect
from .forms import FlightForm
from django.contrib import messages



# Create your views here.
def index(request):
    flights = Flight.objects.all()
    return render(request, "flight_tracker/index.html", {"flights": flights})

def add_flight(request):        
    if request.method == "POST":
        form = FlightForm(request.POST)
        if form.is_valid():
            flight = Flight.objects.create(**form.cleaned_data)
            flight.save()
            messages.success(request, "Posting added successfully!")
            return redirect("flight_tracker:index")

        else:
            return render(request, "flight_tracker/add_flight.html", {"form": form})
    else:
        return render(request, "flight_tracker/add_flight.html", {"form": FlightForm()})
    
    
def fetch_flights(request):
    flights = get_list_or_404(Flight)
    return JsonResponse([flight.serialize() for flight in flights], safe=False)