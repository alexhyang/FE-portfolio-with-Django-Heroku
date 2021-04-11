from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'showcase/index.html')

def survey(request):
    return render(request, 'showcase/survey.html')