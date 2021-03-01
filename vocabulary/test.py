from .models import WordList, User, Word

all_lists = WordList.objects.all()
all_users = User.objects.all()

print(all_lists)
print(all_users)
