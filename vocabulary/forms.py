from django.forms import widgets
from .models import WordList, Setting

from django import forms

TITLE_CASE_CHOICES = (
    ("normal", "normal case"),
    ("uppercase", "uppercase")
)

DEFINITION_CHOICES = (
    ("short", "short definition"),
    ("full", "full definition")
)

class LoginForm(forms.Form):
    username = forms.CharField(label="username", max_length=16, required=True)
    password = forms.CharField(label="password", max_length=32, required=True, widget=forms.PasswordInput(render_value = True))
    
        
class WordlistForm(forms.ModelForm):
    class Meta:
        model = WordList
        fields = ['name', 'description']

class SettingForm(forms.ModelForm):
    class Meta:
        model = Setting
        fields = ['word_title_case', 'word_definition']
        widgets = {
            "word_title_case": forms.Select(choices=TITLE_CASE_CHOICES),
            "word_definition": forms.Select(choices=DEFINITION_CHOICES),            
        }