from django.urls import path

from . import views

app_name = "flight_tracker"

urlpatterns = [
  path("", views.index, name="index"),
  path("fetch", views.fetch_flights, name="fetch_flights"),
  path("add-flight", views.add_flight, name="add_flight")
]