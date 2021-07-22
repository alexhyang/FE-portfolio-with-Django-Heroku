from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.urls import reverse
from django.core.paginator import Paginator
from django.contrib import messages

from .models import User, WordList, Word, Oxford, Setting
from .forms import SettingForm, WordlistForm, LoginForm
from .call_external_api import *

import re
import json
import random

# page config
WORD_EACH_PAGE = 3


# index page and login, logout, registration pages
def index(request):
    if request.user.is_authenticated:
        wordlists = WordList.objects.filter(owner=request.user)
        setting = Setting.objects.get(user=request.user)
        definition = setting.word_definition
        return render(
            request,
            "vocabulary/index.html",
            {"wordlists": wordlists, "setting": setting, "definition": definition},
        )
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
            return redirect("vocabulary:index")
        else:
            return render(
                request,
                "vocabulary/login.html",
                {"message": "Invalid username and/or password.", "form": LoginForm()},
            )
    else:
        return render(request, "vocabulary/login.html", {"form": LoginForm()})


def dummy(request):
    return render(
        request,
        "vocabulary/login.html",
        {"form": LoginForm({"username": "dummy", "password": "dummypassword"})},
    )


def logout_view(request):
    logout(request)
    return redirect("vocabulary:index")


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
        settings = Setting.objects.create(user=user)
        settings.save()
        default_list = WordList.objects.create(name="default", owner=user)
        default_list.save()

        login(request, user)
        return redirect("vocabulary:index")
    else:
        return render(request, "vocabulary/register.html")


# form action: save to list
@login_required
def save_to_list(request):
    if request.method == "POST":
        # Get submission info
        user = request.user
        unique_words = (
            request.POST["result"].lower().split(",")
        )  # the result is a long string
        list_name = request.POST["list"]

        # Connect to database
        wordlist = WordList.objects.get(name=list_name, owner=user)

        # add words if they are new
        counter_saved = 0
        counter_skipped = 0
        for word in unique_words:
            word = CallExternalOxford(word)
            # retrieve the root of the word from API call
            word.call_lemmas()
            # if it is new word, save to database, otherwise skip
            if (word.status_code["lemmas"] == 200) and (
                not Word.objects.filter(word=word.root, wordlist=wordlist).exists()
            ):
                word = Word.objects.create(word=word.root, wordlist=wordlist, user=user)
                word.save()
                counter_saved += 1
            else:
                counter_skipped += 1

        # update wordlist count
        wordlist.count = wordlist.words.all().count()
        wordlist.save()

        # show result in a message
        if counter_saved == 0:
            messages.warning(
                request, f'No new words are saved in your list "{list_name}"!'
            )
        else:
            messages.success(
                request,
                f'{counter_saved} unique words saved in list "{list_name}"! {counter_skipped} unique words are skipped.',
            )

    return redirect("vocabulary:index")


# page: manage list setting
@login_required
def manage_lists(request):
    wordlists = get_list_or_404(WordList, owner=request.user)
    return render(request, "vocabulary/manage_lists.html", {"wordlists": wordlists})


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
                WordList.objects.create(
                    name=name, owner=request.user, description=description
                )
                messages.success(request, f'Wordlist "{name}" was created!')
                return redirect("vocabulary:manage_lists")
            else:
                messages.warning(request, f"{name} already exists.")
                return render(
                    request,
                    "vocabulary/add_list.html",
                    {
                        "form": form,
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


# page & http action: update account setting
@login_required
def update_account_settings(request):
    wordlists = WordList.objects.filter(owner=request.user)
    if request.method == "POST":
        form = SettingForm(request.POST)
        if form.is_valid():
            title_case = form.cleaned_data["word_title_case"]
            definition = form.cleaned_data["word_definition"]
            Setting.objects.filter(user=request.user).update(
                word_title_case=title_case, word_definition=definition
            )
            messages.success(request, f"Account settings updated!")
            return redirect("vocabulary:update_account_settings")

        else:
            return render(
                request,
                "vocabulary/manage_account.html",
                {"form": form, "wordlists": wordlists},
            )
    else:
        setting = Setting.objects.get(user=request.user)
        return render(
            request,
            "vocabulary/manage_account.html",
            {"form": SettingForm(instance=setting), "wordlists": wordlists},
        )


# http action: remove list
@login_required
def remove_list(request, name):
    wordlist = get_object_or_404(WordList, name=name, owner=request.user)
    if request.method == "POST":
        wordlist.delete()
        messages.success(request, f'Wordlist "{name}" was deleted!')
    return HttpResponseRedirect(reverse("vocabulary:manage_lists"))


# page: wordlist
@login_required
def wordlist(request, list_id):
    # the list to show on the page
    wordlist = get_object_or_404(WordList, pk=list_id, owner=request.user)
    # the lists in navbar dropdown button
    wordlists = get_list_or_404(WordList, owner=request.user)

    words = Word.objects.filter(wordlist=wordlist)
    num_pages = Paginator(words, WORD_EACH_PAGE).num_pages
    setting = Setting.objects.get(user=request.user)
    return render(
        request,
        "vocabulary/wordlist.html",
        {
            "wordlist": wordlist,
            "wordlists": wordlists,
            "num_pages": num_pages,
            "setting": setting,
        },
    )


# API: fetch list entries
@login_required
def fetch_entries(request, list_id, page_num=1):
    # retrieve words in wordlist
    wordlist = get_object_or_404(WordList, pk=list_id)
    words = get_list_or_404(Word, wordlist=wordlist)
    # pagination
    word_paginator = Paginator(words, WORD_EACH_PAGE)
    page_words = word_paginator.get_page(page_num).object_list
    return JsonResponse([word.serialize() for word in page_words], safe=False)


# API: fetch meanings
def fetch_meanings(request, word, dict=Oxford):
    words_dict = dict.objects.filter(word__iexact=word)
    if words_dict.count() != 0:
        return JsonResponse([word.serialize() for word in words_dict], safe=False)
    else:
        return call_external_api(word, dict)


# helper function
def call_external_api(word, dict=Oxford):
    # save word from Oxford dictionary API
    if dict == Oxford:
        word = CallExternalOxford(word)
        word_json = word.call_entries()
        if (word.status_code["entries"] == 403) or (word.status_code["entries"] == 404):
            return JsonResponse(
                [
                    {
                        "word": word.word,
                        "error_message": "server unable to fetch entry from https://od-api.oxforddictionaries.com",
                    }
                ],
                safe=False,
            )
        else:
            if word_json != {}:
                new_word = Oxford.objects.create(**word_json)
                new_word.save()
            return JsonResponse([word_json], safe=False)


# page: random words
def random_words(request):
    wordlists = WordList.objects.filter(owner=request.user)
    setting = Setting.objects.get(user=request.user)
    return render(
        request,
        "vocabulary/random_words.html",
        {"wordlists": wordlists, "setting": setting},
    )


# API: fetch random words from all lists
def fetch_random_words(request):
    words = Word.objects.filter(user=request.user)
    words_count = words.count()
    selector = random.sample(range(0, words_count - 1), WORD_EACH_PAGE)
    words_list = []
    for i in selector:
        words_list.append(words[i])
    return JsonResponse([word.serialize() for word in words_list], safe=False)
