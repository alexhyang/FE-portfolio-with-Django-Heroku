from django.db import models

# Create your models here.
class Posting(models.Model):
    position = models.CharField(max_length=32)
    position_level = models.CharField(max_length=16, blank=True)
    position_type = models.CharField(max_length=64)
    posting_url = models.URLField()
    posting_due_date = models.DateField()
    responsibilities = models.TextField()
    qualifications = models.TextField()
    skills = models.CharField(max_length=256)
    company = models.CharField(max_length=64)
    place = models.CharField(max_length=32)
    other = models.TextField(blank=True)

    def __str__(self):
        return f"{self.id}: {self.position}, {self.company}, {self.place}, {self.posting_due_date}, {self.skills}"