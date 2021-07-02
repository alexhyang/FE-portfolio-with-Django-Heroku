from django.db import models

# Create your models here.
class Posting(models.Model):
    position = models.CharField(max_length=32)
    position_level = models.CharField(max_length=16, blank=True)
    position_type = models.CharField(max_length=64)
    posting_url = models.URLField()
    posting_due_date = models.DateField()
    qualifications = models.TextField()
    skills = models.TextField()
    company = models.CharField(max_length=64)
    place = models.CharField(max_length=32)
    other = models.TextField(blank=True)

    def __str__(self):
        return f"{self.position}, {self.company}, {self.place}, {self.posting_due_date}"