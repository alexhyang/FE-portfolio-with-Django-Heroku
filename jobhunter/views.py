from django.shortcuts import get_list_or_404, render, redirect, get_object_or_404
from .models import Posting
from .forms import PostingForm

# Create your views here.
def index(request):
    postings = Posting.objects.all()
    return render(request, "jobhunter/index.html", {"postings": postings})


def add(request):
    if request.method == "POST":
        form = PostingForm(request.POST)
        if form.is_valid():
            position = form.cleaned_data["position"]
            position_level = form.cleaned_data["position_level"]
            position_type = form.cleaned_data["position_type"]
            posting_url = form.cleaned_data["posting_url"]
            posting_due_date = form.cleaned_data["posting_due_date"]
            qualifications = form.cleaned_data["qualifications"]
            skills = form.cleaned_data["skills"]
            company = form.cleaned_data["company"]
            place = form.cleaned_data["place"]
            other = form.cleaned_data["other"]

            posting = Posting.objects.create(
                position=position,
                position_level=position_level,
                position_type=position_type,
                posting_url=posting_url,
                posting_due_date=posting_due_date,
                qualifications=qualifications,
                skills=skills,
                company=company,
                place=place,
                other=other
            )
            posting.save()
            return redirect("jobhunter:index")
        
        else:
            render(request, "jobhunter/add.html", {"form": form})
    else:
        return render(request, "jobhunter/add.html", {"form": PostingForm()})


def posting(request, id):
    posting = get_object_or_404(Posting, pk=id)
    return render(request, "jobhunter/posting.html", {"posting": posting})