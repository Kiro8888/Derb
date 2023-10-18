from rest_framework import viewsets, status, serializers
from open_question.models import OpenQuestion, Response, Form
from .serializer import OpenQuestionSerializer, ResponseSerializer, FormSerializer
from .models import OpenQuestion, Response


class OpenQuestionViewSet(viewsets.ModelViewSet):
    queryset = OpenQuestion.objects.all()
    serializer_class = OpenQuestionSerializer


class ResponseQuestionViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer

class FormQuestionViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer








