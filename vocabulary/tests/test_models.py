from django.test import TestCase
from django.db.models import Max

from vocabulary.models import Word, WordList, Dict, User

# Create your tests here.
class WordTestCase(TestCase):
    def setUp(self):
        # create user
        u1 = User.objects.create_user(username="u1", email="u1@test.com", password="u1password")
        
        # create word list
        wl1 = WordList.objects.create(name="test_list", owner=u1, description="First list")
        
        # create word
        word1 = Word.objects.create(word="test", wordlist=wl1, user=u1)
        
    def test_wordlist_count(self):
        u = User.objects.get(username="u1")
        self.assertEqual(u.wordlist.count(), 1)
        
class WordListTestCase(TestCase):
    pass

class DictTestCase(TestCase):
    pass