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
    lexical_category = models.CharField(max_length=16)
    audio_link = models.TextField(blank=False, max_length=256, default="")
    ipa = models.CharField(max_length=32, default="")
    inflections = models.CharField(max_length=128, default="")
    senses = models.TextField(blank=False, default="No such word")
    derivatives = models.TextField(blank=True, default="No derivatives")

    def __str__(self):
        return f"{self.word}, {self.lexical_category}"
    
    def serialize(self):
        return {
            "word": self.word,
            "lexical_category": self.lexical_category,
            "audio_link": self.audio_link,
            "ipa": self.ipa,
            "inflections": self.inflections,
            "senses": self.senses,
            "derivatives": self.derivatives
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
