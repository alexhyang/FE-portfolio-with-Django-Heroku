from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponseBadRequest
from django.db import IntegrityError
from django.shortcuts import render
from django.urls import reverse

from .models import User, WordList, Word
from .forms import WordForm, WordlistForm

import re

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        try:
            wordlists = WordList.objects.filter(owner = request.user)
        except WordList.DoesNotExist:
            raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
        return render(request, "vocabulary/index.html", {
            "wordlists": wordlists
        })
    else:
        return render(request, "vocabulary/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "vocabulary/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "vocabulary/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "vocabulary/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "vocabulary/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "vocabulary/register.html")

@login_required
def save(request):
    return render(request, "vocabulary/index.html")
    """ if request.method == "POST":
        user = request.user
        result = request.POST["result"] #"result" is a long string
        wordlist = request.POST["listOption"]
        
        uniqueWords = set(re.split(r'[^A-Za-z\-]+', result))
        
        for word in uniqueWords:
            
            try:
                word = Word.objects.create(word=word, wordlist=wordlist, user=user)
                word.save()
            except IntegrityError:
                return render(request, "vocabulary/register.html", {
                    "message": "Username already taken."
                })

        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "vocabulary/register.html") """

@login_required  
def wordlists(request):
    try:
        wordlists = WordList.objects.filter(owner = request.user)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    return render(request, "vocabulary/wordlist_index.html", {
        "wordlists": wordlists
    })

@login_required
def add_list(request):
    if request.method == "POST":
        form = WordlistForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            if len(WordList.objects.filter(name=name)) == 0:
                WordList.objects.create(name=name, owner=request.user)
                return HttpResponseRedirect(reverse("wordlist_index"))
            else:
                return render(request, "vocabulary/add_list.html", {
                    "form": form,
                    "message": f"{name} already exists."
                })

        else:
            return render(request, "vocabulary/add_list.html", {
                "form": form
            })
    else:
        return render(request, "vocabulary/add_list.html", {
            "form": WordlistForm()
        })
        
@login_required
def wordlist(request, name):
    try:
        wordlist = WordList.objects.get(name=name)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    return render(request, "vocabulary/wordlist.html", {
        "wordlist": wordlist
    })

@login_required
def remove_list(request, name):
    try:
        wordlist = WordList.objects.get(name=name)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    wordlist.delete()
    return HttpResponseRedirect(reverse("wordlist_index"))