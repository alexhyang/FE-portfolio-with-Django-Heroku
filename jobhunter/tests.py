from django.test import TestCase, Client

# Create your tests here.
class URLTests(TestCase):
  def test_app_homepage(self):
    c = Client()
    response = c.get("/jobhunter-app/")
    self.assertEqual(response.status_code, 200)
    
  def test_add_posting_page(self):
    c = Client()
    response = c.get("/jobhunter-app/add_posting")
    self.assertEqual(response.status_code, 200)
    
  def test_skill_summary_page(self):
    c = Client()
    response = c.get("/jobhunter-app/skills")
    self.assertEqual(response.status_code, 200)
    
  def test_posting_page(self):
    c = Client()
    response = c.get("/jobhunter-app/posting/")
    self.assertEqual(response.status_code, 200)
    
  def test_posting_notes_page(self):
    c = Client()
    response = c.get("/jobhunter-app/notes")
    self.assertEqual(response.status_code, 200)