from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("survey", views.survey, name="survey"),
    path("tribute", views.tribute, name="tribute"),
    path("products", views.products, name="products")
]