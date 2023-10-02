from django.db import models
class OpenQuestion(models.Model):

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    placeholder = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title
