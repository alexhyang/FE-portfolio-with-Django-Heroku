from django.contrib.auth.models import AbstractUser
from django.db import models

# admin database
class User(AbstractUser):
    pass


class Settings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="settings")
    list_card_uppercase = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: settings"


# word database
class Dict(models.Model):
    word = models.CharField(max_length=32)
    entries = models.TextField(blank=False, default="No such word")
    derivatives = models.TextField(blank=True, default="No derivatives")

    def __str__(self):
        return f"{self.word}, derivatives: {self.derivatives}"
    
    def serialize(self):
        derivatives = ', '.join([derivative for derivative in eval(self.derivatives)])
        return {
            "word": self.word,
            "entries": eval(self.entries),
            "derivatives": derivatives
        }


class Merriam(Dict):
    pass


class Oxford(Dict):
    pass


class Collins(Dict):
    pass


class WordList(models.Model):
    name = models.CharField(max_length=64)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wordlist")
    timestamp = models.DateTimeField(auto_now_add=True)
    count = models.IntegerField(default=0)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.id}: {self.name} created by {self.owner}"


class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlist = models.ForeignKey(WordList, on_delete=models.CASCADE, related_name="words")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="words")

    def __str__(self):
        return f"{self.word} was saved in {self.wordlist}"
    
    def serialize(self):
        return {"word": self.word}
