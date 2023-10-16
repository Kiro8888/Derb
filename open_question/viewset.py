from rest_framework import viewsets, status, serializers
from open_question.models import OpenQuestion, Response
from .serializer import OpenQuestionSerializer, ResponseSerializer
from .models import OpenQuestion, Response


class OpenQuestionViewSet(viewsets.ModelViewSet):
    queryset = OpenQuestion.objects.all()
    serializer_class = OpenQuestionSerializer


class ResponseQuestionViewSet(viewsets.ModelViewSet):


    queryset = Response.objects.all()
    serializer_class = ResponseSerializer









