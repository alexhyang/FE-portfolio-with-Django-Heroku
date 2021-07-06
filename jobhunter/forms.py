from django.db.models import fields
from django.forms import widgets
from .models import Posting

from django import forms

LEVEL_CHOICES = (
    ("Unknown", "Unknown"),
    ("Junior", "Junior (less than 3 years)"),
    ("Intermediate", "Intermediate (3~5 years)"),
    ("Senior", "Senior (more than 5 years)"),
    ("Intern", "Intern"),
    ("Other", "Other")
)

TYPE_CHOICES = (
    ("Part-time", "Part-time"),
    ("Full-time", "Full-time"),
    ("Temporary", "Temporary"),
    ("Contract", "Contract"),
    ("Remote", "Remote"),
    ("Internship", "Internship"),
    ("Co-op", "Co-op"),
    ("Other", "Other")
)

PLACE_CHOICES = (
    ("Vancouver, BC", "Vancouver, BC"),
    ("Burnaby, BC", "Burnaby, BC"),
    ("Richmond, BC", "Richmond, BC"),
    ("Surrey, BC", "Surrey, BC"),
    ("Victoria, BC", "Victoria, BC"),
    ("Kamloops, BC", "Kamloops, BC"),
    ("Brentwood Bay, BC", "Brentwood Bay, BC")
)

class PostingForm(forms.ModelForm):
    class Meta:
        model = Posting
        fields = [
            "position",
            "company",
            "place",
            "position_level",
            "position_type",
            "posting_url",
            "posting_due_date",
            "responsibilities",
            "qualifications",
            "skills",
            "other",
        ]
        widgets = {
            "position_level": forms.Select(choices=LEVEL_CHOICES),
            "position_type": forms.SelectMultiple(choices=TYPE_CHOICES),
            #"place": forms.Select(choices=PLACE_CHOICES),
            "posting_due_date": forms.TextInput(attrs={'type': 'date'}),
            "posting_url": forms.TextInput(attrs={'type': 'url'})
        }
