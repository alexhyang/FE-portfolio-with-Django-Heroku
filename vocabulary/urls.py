from django.urls import path

from . import views

app_name = "vocabulary"

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("sign_up", views.register, name="register"),
    
    # user interaction
    path("lists/<int:list_id>", views.wordlist, name="wordlist"),
    path("random", views.random_words, name="random_words"),
    
    # list manipulation
    path("save", views.save_to_list, name="save_to_list"),
    path("lists/add_list", views.add_list, name="add_list"),
    path("lists/<str:name>/remove", views.remove_list, name="remove_list"),
    path("lists", views.manage_lists, name="manage_lists"),
    
    #  API routes
    path("lists/<int:list_id>/<int:page_num>", views.fetch_entries, name="fetch_wordlist"), # fetch words
    path("dict/<str:word>", views.fetch_meanings, name="fetch_wordlist"), # fetch word details
    path("random/new", views.fetch_random_words, name="fetch_random_words"), # fetch random words
]