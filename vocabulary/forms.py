from .models import Word, WordList

from django import forms
class LoginForm(forms.Form):
    username = forms.CharField(label="username", max_length=16, required=True)
    password = forms.CharField(label="password", max_length=32, required=True, widget=forms.PasswordInput(render_value = True))
    
class WordForm(forms.ModelForm):
    class Meta:
        model = Word
        fields = ['word', 'wordlist']
        
class WordlistForm(forms.ModelForm):
    class Meta:
        model = WordList
        fields = ['name', 'description']