from django.test import TestCase, Client
from django.urls import reverse

from vocabulary.models import User

class URLTests(TestCase):
  def test_app_homepage(self):
    c = Client()
    response = c.get("/vocabulary-app/")
    self.assertEqual(response.status_code, 200)
    
  def test_login_page(self):
    c = Client()
    response = c.get("/vocabulary-app/login")
    self.assertEqual(response.status_code, 200)
    
  def test_logout_page(self):
    c = Client()
    response = c.get("/vocabulary-app/logout")
    self.assertEqual(response.status_code, 302)
    
  def test_register_page(self):
    c = Client()
    response = c.get("/vocabulary-app/sign_up")
    self.assertEqual(response.status_code, 200)
    
  def test_dummy_account_page(self):
    c = Client()
    response = c.get("/vocabulary-app/dummy")
    self.assertEqual(response.status_code, 200)
    
  # TODO: test user interaction, list manipulation, APIs