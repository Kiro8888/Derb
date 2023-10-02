from rest_framework import viewsets
from .models import OpenQuestion
from .serializer import OpenQuestionSerializer


class OpenQuestionViewSet(viewsets.ModelViewSet):
    queryset = OpenQuestion.objects.all()
    serializer_class = OpenQuestionSerializer
