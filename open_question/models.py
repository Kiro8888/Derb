from django.db import models
class OpenQuestion(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    placeholder = models.CharField(max_length=255, blank=True, null=True)
    help = models.CharField(max_length=255, blank=True, null=True)
    list_order = models.IntegerField(default=0, editable=True, blank=True)

    #json
    json = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.list_order:
            last_item = OpenQuestion.objects.last()
            if last_item:
                self.list_order = last_item.list_order + 1
            else:
                self.list_order = 1
        super(OpenQuestion, self).save(*args, **kwargs)


class Response(models.Model):
    response = models.TextField(blank=True, null=True)
    questions = models.OneToOneField(OpenQuestion, on_delete=models.CASCADE)

    def __str__(self):
        return self.response



my_form = {
    'config': {
        'name': 'Mi Formulario',
        'start_date': '2023-01-01',
        'end_date': '2023-12-31',
    },
    'data': [
        {
            'title': 'Categoría 1',
            'children': [
                {
                    'title': 'Subcategoría 1',
                    'children': [
                        {
                            'class': 'number',
                            'title': 'Pregunta 1',
                            'description': 'Descripción de la Pregunta 1',
                            'required': True,
                        },
                        {
                            'class': 'boolean',
                            'title': 'Pregunta 2',
                            'description': 'Descripción de la Pregunta 2',
                            'required': False,
                        },
                    ],
                },
            ],
        },
    ],
}