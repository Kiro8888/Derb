from django.db import models
from django.db.models import Max
from django.contrib.auth.models import User
class OpenQuestion(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    placeholder = models.CharField(max_length=255, blank=True, null=True)
    help = models.CharField(max_length=255, blank=True, null=True)
    list_order = models.IntegerField(default=0, editable=True, blank=True)


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.pk is None:
            # Si es un nuevo registro, obtén el valor máximo actual y suma 1
            max_order = OpenQuestion.objects.aggregate(models.Max('list_order'))['list_order__max']
            if max_order is not None:
                self.list_order = max_order + 1
            else:
                self.list_order = 1
        super(OpenQuestion, self).save(*args, **kwargs)


class Response(models.Model):
    response = models.TextField(blank=True, null=True)
    questions = models.ForeignKey(OpenQuestion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.response




class Form(models.Model):
    title_form = models.CharField(max_length=255)
    title_description = models.TextField(blank=True, null=True)
    questions_form = models.ManyToManyField(OpenQuestion)

    def __str__(self):
        return self.title_form



