from rest_framework import viewsets, status
from open_question.models import OpenQuestion, Response
from .serializer import OpenQuestionSerializer, ResponseSerializer, CategorySerializer
from open_question.form_openquestion import form

class OpenQuestionViewSet(viewsets.ModelViewSet):
    queryset = OpenQuestion.objects.all()
    serializer_class = CategorySerializer #OpenQuestionSerializer


class ResponseQuestionViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer








