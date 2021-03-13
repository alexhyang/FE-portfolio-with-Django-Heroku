from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass


class WordDict(models.Model):
    word = models.CharField(max_length=32)
    meaning = models.TextField(blank=True)

    def __str__(self):
        return f"{self.word}"


class WordList(models.Model):
    name = models.CharField(max_length=64)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="wordlist"
    )  # User.wordlist --> many wordlists to one user
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name}"


class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlists = models.ManyToManyField(
        WordList, blank=True, related_name="words"
    )  # Wordlist.word --> many words to many wordlists
    users = models.ManyToManyField(
        User, related_name="words"
    )  # User.word --> many words to many users

    def __str__(self):
        return f"{self.word}"


class Settings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="settings")
    list_card_uppercase = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: settings"