from django.urls import path

from . import views

urlpatterns = [
    path("app/", views.index, name="index"),
    path("app/login", views.login_view, name="login"),
    path("app/logout", views.logout_view, name="logout"),
    path("app/sign_up", views.register, name="register"),
    path("app/save", views.save, name="save"),
    path("app/lists", views.manage_lists, name="manage_lists"),
    path("app/lists/add_list", views.add_list, name="add_list"),
    path("app/lists/<str:name>", views.wordlist, name="wordlist"),
    path("app/lists/<str:name>/remove", views.remove_list, name="remove_list")
]