from django.urls import path

from . import views

urlpatterns = [
    path("en-vocab-app/", views.index, name="index"),
    path("en-vocab-app/login", views.login_view, name="login"),
    path("en-vocab-app/logout", views.logout_view, name="logout"),
    path("en-vocab-app/sign_up", views.register, name="register"),
    path("en-vocab-app/save", views.save, name="save"),
    path("en-vocab-app/lists", views.manage_lists, name="manage_lists"),
    path("en-vocab-app/lists/add_list", views.add_list, name="add_list"),
    path("en-vocab-app/lists/<str:name>", views.wordlist, name="wordlist"),
    path("en-vocab-app/lists/<str:name>/remove", views.remove_list, name="remove_list")
]