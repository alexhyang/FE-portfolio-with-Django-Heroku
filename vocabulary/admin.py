from django.contrib import admin
from .models import User, WordList, Word, WordDict, Settings

# Register your models here.
admin.site.register(User)
admin.site.register(WordList)
admin.site.register(Word)
admin.site.register(WordDict)
admin.site.register(Settings)