from django.urls import path

from . import views

app_name = "jobhunter"

urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add, name="add"),
    path("posting/<int:id>", views.posting, name="posting")
]