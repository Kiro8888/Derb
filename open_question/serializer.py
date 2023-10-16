from rest_framework import serializers
from .models import OpenQuestion, Response

class OpenQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenQuestion
        fields = '__all__'

class ResponseSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(queryset=OpenQuestion.objects.all(),
                                                   required=True)  # Añade 'required=True'

    class Meta:
        model = Response
        fields = '__all__'






