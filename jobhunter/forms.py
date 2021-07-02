from django.db.models import fields
from django.forms import widgets
from .models import Posting

from django import forms

LEVEL_CHOICES = (
    ("", ""),
    ("junior", "Junior"),
    ("intermediate", "Intermediate"),
    ("senior", "Senior"),
    ("intern", "Intern"),
    ("other", "Other"),
)

TYPE_CHOICES = (
    ("part-time", "Part-time"),
    ("full-time", "Full-time"),
    ("temporary", "Temporary"),
    ("contract", "Contract"),
    ("remote", "Remote"),
    ("other", "Other"),
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
            "posting_due_date": forms.TextInput(attrs={'type': 'date'}),
            "posting_url": forms.TextInput(attrs={'type': 'url'})
        }
