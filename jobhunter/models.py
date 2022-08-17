from django.db import models

# Create your models here.
class Posting(models.Model):
    position = models.CharField(max_length=32)
    level = models.CharField(max_length=16)
    type = models.CharField(max_length=64)
    url = models.URLField()
    due_date = models.DateField()
    responsibilities = models.TextField()
    qualifications = models.TextField()
    skills = models.CharField(max_length=256)
    company = models.CharField(max_length=64)
    location = models.CharField(max_length=32)
    other = models.CharField(max_length=256, blank=True)

    def __str__(self):
        return f"{self.id}: {self.position}, {self.company}, {self.location}, {self.due_date}, {self.skills}"
