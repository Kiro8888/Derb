from rest_framework import serializers
from .models import OpenQuestion, Response

class OpenQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenQuestion
        fields = '__all__'

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'



class CategorySerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=False)
    placeholder = serializers.CharField(required=False)
    help = serializers.CharField(required=False)
    list_order = serializers.IntegerField(default=0)







