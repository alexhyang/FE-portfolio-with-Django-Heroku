from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponseBadRequest, JsonResponse
from django.db import IntegrityError
from django.shortcuts import render
from django.urls import reverse

from .models import User, WordList, Word, Oxford, Settings
from .forms import WordForm, WordlistForm

import re

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        try:
            wordlists = WordList.objects.filter(owner=request.user)
        except WordList.DoesNotExist:
            raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
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
        try:
            settings = Settings.objects.create(user=user)
            settings.save()
        except IntegrityError:
            return render(
                request,
                "vocabulary/register.html",
                {"message": "Something is wrong with settings."},
            )
        login(request, user)
        return HttpResponseRedirect(reverse("vocabulary:index"))
    else:
        return render(request, "vocabulary/register.html")


@login_required
def save(request):
    if request.method == "POST":
        # Get submission info
        user = request.user
        words = request.POST["result"].lower()  # "result" is a long string
        list_name = request.POST["list_option"]

        # Handle submission data
        unique_words = set(re.split(r"[^A-Za-z\-]+", words))
        clean_unique_words = [word for word in unique_words if word != ""]

        # Connect to database
        wordlist = WordList.objects.get(name=list_name, owner=user)

        # API gets meaning of word

        # Modify database if condition satisfied
        words_saved = 0
        for word in clean_unique_words:
            if new_word(word, wordlist):
                word_dict = Oxford.objects.create(word=word)
                word_dict.save()
                word = Word.objects.create(word=word)
                word.users.add(user)
                word.wordlists.add(wordlist)
                words_saved += 1

    return HttpResponseRedirect(reverse("vocabulary:index"))


@login_required
def manage_lists(request):
    try:
        wordlists = WordList.objects.filter(owner=request.user)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    return render(request, "vocabulary/settings__manage_lists.html", {"wordlists": wordlists})


@login_required
def add_list(request):
    try:
        wordlists = WordList.objects.filter(owner=request.user)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    if request.method == "POST":
        form = WordlistForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            if len(WordList.objects.filter(name=name)) == 0:
                WordList.objects.create(name=name, owner=request.user)
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


@login_required
def wordlist(request, name):
    try:
        wordlist = WordList.objects.get(name=name)
        wordlists = WordList.objects.filter(owner=request.user)
        settings = Settings.objects.get(user=request.user)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    except Settings.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Settings not found.")
    return render(
        request,
        "vocabulary/wordlist.html",
        {"wordlist": wordlist, "wordlists": wordlists, "settings": settings},
    )

@login_required
def wordlist2(request):
    pass
    # wordlist = WordList.objects.get(name=name)
    # wordlists = WordList.objects.filter(owner=request.user)
    # continue from here

@login_required
def remove_list(request, name):
    try:
        wordlist = WordList.objects.get(name=name)
    except WordList.DoesNotExist:
        raise HttpResponseBadRequest("Bad Request: Wordlist not found.")
    wordlist.delete()
    return HttpResponseRedirect(reverse("vocabulary:manage_lists"))


def new_word(word, wordlist):
    existing_words = wordlist.words.all().values_list("word", flat=True)
    return word not in existing_words