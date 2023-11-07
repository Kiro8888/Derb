from rest_framework import serializers
from open_question.models import OpenQuestion, Response, Form

class OpenQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenQuestion
        fields = '__all__'

class ResponseSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(queryset=OpenQuestion.objects.all(),
                                                   required=True)

    class Meta:
        model = Response
        fields = '__all__'



class FormSerializer(serializers.ModelSerializer):
    title_form = serializers.CharField(required=False)
    class Meta:
        model = Form
        fields = '__all__'
