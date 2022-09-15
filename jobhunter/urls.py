from django.urls import path

from . import views

app_name = "jobhunter"

urlpatterns = [
    path("", views.index, name="index"),
    path("add_posting", views.add_posting, name="add_posting"),
    path("skills", views.skill_summary, name="skill_summary"),
    path("notes", views.notes, name="notes"),
    path("posting/<int:id>", views.posting, name="posting"),
    
    
    #API routes
    path("add/check", views.posting_is_new, name="posting_is_new"),
    path("skills/fetch", views.fetch_skills, name="fetch_skills"),
    path("fetch_all_postings", views.fetch_all_postings, name="fetch_all_postings"),
    path("api/add-posting", views.api_add_posting, name="api_add_posting")
]
