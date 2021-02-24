from .models import Word, WordList

from django.forms import ModelForm, Form

class WordForm(ModelForm):
    class Meta:
        model = Word
        fields = ['word', 'wordlist']
        
class WordlistForm(ModelForm):
    class Meta:
        model = WordList
        fields = ['name']