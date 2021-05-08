from django.urls import path

from . import views

app_name = "vocabulary"

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("sign_up", views.register, name="register"),
    
    # user interaction
    path("save", views.save, name="save"),
    path("lists", views.manage_lists, name="manage_lists"),
    path("lists/add_list", views.add_list, name="add_list"),
    path("lists/<str:name>", views.wordlist, name="wordlist"),
    path("lists/<str:name>/remove", views.remove_list, name="remove_list"),
    
    #  API routes

]