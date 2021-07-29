from django.urls import path

from . import views

app_name = "jobhunter"

urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add, name="add"),
    path("skills", views.skills, name="skills"),
    path("notes", views.notes, name="notes"),
    path("posting/<int:id>", views.posting, name="posting"),
    
    
    #API routes
    path("add/check", views.check_url, name="check_url"),
    path("skills/fetch", views.fetch_skills, name="fetch_skills")
]