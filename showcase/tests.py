from django.http import response
from django.test import TestCase, Client

# Create your tests here.
class URLTests(TestCase):
  def test_portfolio_homepage(self):
    c = Client()
    response = c.get("/")
    self.assertEqual(response.status_code, 200)
    
  def test_vocabulary_app_homepage(self):
    c = Client()
    response = c.get("/vocabulary-app/")
    self.assertEqual(response.status_code, 200)
    
  def test_jobhunter_app_homepage(self):
    c = Client()
    response = c.get("/jobhunter-app/")
    self.assertEqual(response.status_code, 200)
  
