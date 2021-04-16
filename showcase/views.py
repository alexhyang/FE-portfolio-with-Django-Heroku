from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'showcase/index.html')

def survey(request):
    return render(request, 'showcase/survey.html')

def tribute(request):
    return render(request, "showcase/tribute.html")

def products(request):
    return render(request, "showcase/products.html")