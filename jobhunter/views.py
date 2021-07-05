from django.http.response import HttpResponseRedirect
from django.shortcuts import get_list_or_404, render, redirect, get_object_or_404
from django.http import JsonResponse
from django.urls import reverse
from .models import Posting
from .forms import PostingForm
from django.contrib import messages
from urllib.parse import urlparse, parse_qs

import collections

# Create your views here.
def index(request):
    postings = Posting.objects.all()
    return render(request, "jobhunter/index.html", {"postings": postings})


def add(request):
    if request.method == "POST":
        form = PostingForm(request.POST)
        if form.is_valid():
            posting_url = form.cleaned_data["posting_url"]
            company = form.cleaned_data["company"]
            if posting_exists(posting_url, company):
                messages.error(request, "This posting already exists!")
                return render(request, "jobhunter/add.html", {"form": form})
            else:
                position = form.cleaned_data["position"]
                position_level = form.cleaned_data["position_level"]
                position_type = form.cleaned_data["position_type"]
                posting_due_date = form.cleaned_data["posting_due_date"]
                responsibilities = form.cleaned_data["responsibilities"]
                qualifications = form.cleaned_data["qualifications"]
                skills = form.cleaned_data["skills"]
                place = form.cleaned_data["place"]
                other = form.cleaned_data["other"]

                posting = Posting.objects.create(
                    position=position,
                    position_level=position_level,
                    position_type=position_type,
                    posting_url=posting_url,
                    posting_due_date=posting_due_date,
                    responsibilities=responsibilities,
                    qualifications=qualifications,
                    skills=skills,
                    company=company,
                    place=place,
                    other=other
                )
                posting.save()
                messages.success(request, "Posting added successfully!")
                return redirect("jobhunter:index")
        
        else:
            return render(request, "jobhunter/add.html", {"form": form})
    else:
        return render(request, "jobhunter/add.html", {"form": PostingForm()})

def posting_exists(url, company):
    postings = Posting.objects.filter(company=company)
    for posting in postings:
        if get_jk(url) == get_jk(posting.posting_url):
            return True
    return False

def get_jk(url):
    parsed = urlparse(url)
    return parse_qs(parsed.query)['jk'][0]

def posting(request, id):
    posting = get_object_or_404(Posting, pk=id)
    return render(request, "jobhunter/posting.html", {"posting": posting})

def skills(request):
    return render(request, "jobhunter/skills.html")

def fetch_skills(request):
    postings = Posting.objects.values("skills")
    skills = []
    for posting in postings:
        skills.extend(posting["skills"].split(", "))
    counter = collections.Counter(skills)
    counter_json = dict(counter)
    return JsonResponse(counter_json, safe=False)