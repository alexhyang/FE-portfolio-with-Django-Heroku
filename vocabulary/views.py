from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponseBadRequest, JsonResponse
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.urls import reverse
from django.core.paginator import Paginator

from .models import User, WordList, Word, Oxford, Settings
from .forms import WordForm, WordlistForm

import re
import os
import requests
import json

# CONSTANTS
WORD_EACH_PAGE = 10
OXFORD_API_ID = os.environ.get('OXFORD_API_ID')
OXFORD_API_KEY = os.environ.get('OXFORD_API_KEY')

# index page and login, logout, registration pages
def index(request):
    if request.user.is_authenticated:
        wordlists = WordList.objects.filter(owner=request.user)
        return render(request, "vocabulary/index.html", {"wordlists": wordlists})
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
            return HttpResponseRedirect(reverse("vocabulary:index"))
        else:
            return render(
                request,
                "vocabulary/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "vocabulary/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("vocabulary:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request,
                "vocabulary/register.html",
                {"message": "Passwords must match."},
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request,
                "vocabulary/register.html",
                {"message": "Username already taken."},
            )
            
        # create settings and default lists
        settings = Settings.objects.create(user=user)
        settings.save()
        default_list = WordList.objects.create(name="default", owner=user)
        default_list.save()
        
        login(request, user)
        return HttpResponseRedirect(reverse("vocabulary:index"))
    else:
        return render(request, "vocabulary/register.html")


# form action: save to list
@login_required
def save_to_list(request):
    if request.method == "POST":
        # Get submission info
        user = request.user
        result = request.POST["result"].lower()  # the result is a long string
        list_name = request.POST["list_option"]

        # Handle submission data
        unique_words = set(re.split(r"[^A-Za-z\-]+", result))
        clean_unique_words = [word for word in unique_words if word != ""]

        # Connect to database
        wordlist = WordList.objects.get(name=list_name, owner=user)

        # add words is they are new
        for word in clean_unique_words:
            if not Word.objects.filter(word=word, wordlist=wordlist).exists():
                word = Word.objects.create(word=word, wordlist = wordlist, user=user)
                word.save()
                
        # show number of words saved in a popup ???

    return HttpResponseRedirect(reverse("vocabulary:index"))

# page: manage list setting
@login_required
def manage_lists(request):
    wordlists = get_list_or_404(WordList, owner=request.user)
    return render(request, "vocabulary/settings__manage_lists.html", {"wordlists": wordlists})

# page: add list (possible to use a popup?)
@login_required
def add_list(request):
    wordlists = WordList.objects.filter(owner=request.user)
    if request.method == "POST":
        form = WordlistForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            description = form.cleaned_data["description"]
            if not WordList.objects.filter(name=name, owner=request.user).exists():
                WordList.objects.create(name=name, owner=request.user, description=description)
                return HttpResponseRedirect(reverse("vocabulary:manage_lists"))
            else:
                return render(
                    request,
                    "vocabulary/add_list.html",
                    {
                        "form": form,
                        "message": f"{name} already exists.",
                        "wordlists": wordlists,
                    },
                )

        else:
            return render(
                request,
                "vocabulary/add_list.html",
                {"form": form, "wordlists": wordlists},
            )
    else:
        return render(
            request,
            "vocabulary/add_list.html",
            {"form": WordlistForm(), "wordlists": wordlists},
        )

# http action: remove list
@login_required
def remove_list(request, name):
    wordlist = get_object_or_404(WordList, name=name, owner=request.user)
    wordlist.delete()
    return HttpResponseRedirect(reverse("vocabulary:manage_lists"))

# page: wordlist
@login_required
def wordlist(request, list_id):
    wordlist = get_object_or_404(WordList, pk=list_id) # for list information on page
    wordlists = get_list_or_404(WordList, owner=request.user) # for lists in navbar dropdown button
    settings = get_object_or_404(Settings, user=request.user) # for uppercase or lowercase
    return render(
        request,
        "vocabulary/wordlist.html",
        {"wordlist": wordlist, "wordlists": wordlists, "settings": settings},
    )

# API: fetch list entries
@login_required
def list_entries(request, list_id, page_num=1):
    wordlist = get_object_or_404(WordList, pk=list_id)
    words = get_list_or_404(Word, wordlist=wordlist)
    words = dictionarize(Oxford, words)
    # pagination
    return word_pagination(words, WORD_EACH_PAGE, page_num)


# helper function
def word_pagination(words, word_each_page, page_num):
    word_paginator = Paginator(words, word_each_page)
    page_words = word_paginator.get_page(page_num).object_list
    return JsonResponse([word.serialize() for word in page_words], safe=False)

def dictionarize(dict, words):
    # words in wordlist --> words in dict
    # 1. for each word in words, find the instance in dict
    # 2. if the instance doesn't exist, call Oxford API, save the entry, and return words
    words = [word.word for word in words]
    
    return dict.objects.filter(word__in=words)
            
