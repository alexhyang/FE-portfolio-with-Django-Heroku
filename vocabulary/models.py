from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass

class WordList(models.Model):
    name = models.CharField(max_length=64)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wordlist") #User.wordlist --> many wordlists to one user
    
    def __str__(self):
        return f"{self.name}"

class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlist = models.ManyToManyField(WordList, blank=True, related_name="word") #Words.list --> many words to many wordlists
    user = models.ManyToManyField(User, related_name="word") #User.word --> many words to many users
    
    def __str__(self):
        return f"{self.word} in list {self.wordlist}"