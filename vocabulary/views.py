from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "vocabulary/index.html")

def play(request):
    return render(request, "vocabulary/js-playground.html")