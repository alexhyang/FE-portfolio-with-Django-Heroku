from django.contrib import admin
from .models import User, WordList, Word, Oxford, Setting

# Register your models here.
admin.site.register(User)
admin.site.register(WordList)
admin.site.register(Word)
admin.site.register(Oxford)
admin.site.register(Setting)