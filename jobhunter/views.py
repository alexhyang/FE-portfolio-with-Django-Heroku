from django.http.response import HttpResponseRedirect
from django.shortcuts import get_list_or_404, render, redirect, get_object_or_404
from django.http import JsonResponse
from django.urls import reverse
from .models import Posting
from .forms import PostingForm
from django.contrib import messages
from urllib.parse import urlparse, parse_qs
from django.core.paginator import Paginator

import collections

POSTING_PER_PAGE = 20

# Create your views here.
def index(request):
    postings = Posting.objects.all().order_by("-id")
    count = postings.count()
    posting_paginator = Paginator(postings, POSTING_PER_PAGE)
    page_num = request.GET.get('page')
    page = posting_paginator.get_page(page_num)
    
    return render(request, "jobhunter/index.html", {"page": page, "count": count})


def notes(request):
    postings = Posting.objects.all().order_by("-id")
    return render(request, "jobhunter/notes.html", {"postings": postings})


def add(request):
    if request.method == "POST":
        form = PostingForm(request.POST)
        if form.is_valid():
            url = form.cleaned_data["url"]
            if posting_exists(url):
                messages.error(request, "This posting already exists!")
                return render(request, "jobhunter/add.html", {"form": form})
            else:
                posting = Posting.objects.create(**form.cleaned_data)
                posting.save()
                messages.success(request, "Posting added successfully!")
                return redirect("jobhunter:index")

        else:
            return render(request, "jobhunter/add.html", {"form": form})
    else:
        return render(request, "jobhunter/add.html", {"form": PostingForm()})


def posting_exists(url):
    postings = Posting.objects.all()
    for posting in postings:
        if get_jk(url) == get_jk(posting.url):
            return True
    return False


def get_jk(url):
    parsed = urlparse(url)
    return parse_qs(parsed.query)["jk"][0]


def posting(request, id):
    posting = get_object_or_404(Posting, pk=id)
    return render(request, "jobhunter/posting.html", {"posting": posting})


def skills(request):
    return render(request, "jobhunter/skills.html")


# API: fetch skills
def fetch_skills(request):
    postings = Posting.objects.values("skills")
    skills = []
    for posting in postings:
        skills.extend(posting["skills"].split(", "))
    counter = collections.Counter(skills)
    counter_json = dict(counter)
    return JsonResponse(counter_json, safe=False)


# API: url existing
def url_is_new(request):
    if request.method == "GET":
        jk = request.GET["jk"]
        for posting in Posting.objects.all():
            if jk == get_jk(posting.url):
                return JsonResponse({"url_is_new": False, "jk": jk})
        return JsonResponse({"url_is_new": True, "jk": jk})
    else:
        return JsonResponse({"Error message": "GET method is required."}, status=400)
