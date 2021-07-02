from django.urls import path

from . import views

app_name = "jobhunter"

urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add, name="add"),
    path("skills", views.skills, name="skills"),
    path("posting/<int:id>", views.posting, name="posting"),
    
    #API routes
    path("skills/fetch", views.fetch_skills, name="fetch_skills")
]