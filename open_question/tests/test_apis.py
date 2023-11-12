# tests.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from open_question.models import OpenQuestion
from open_question.serializer import OpenQuestionSerializer
from django.urls import reverse

class TestOpenQuestionViewSet(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.client.force_authenticate(user=self.user)

    def test_list_open_questions(self):
        question1 = OpenQuestion.objects.create(title='Pregunta 1', description='Descripción 1')
        question2 = OpenQuestion.objects.create(title='Pregunta 2', description='Descripción 2')

        response = self.client.get('/api/open-questions/')


        self.assertEqual(response.status_code, status.HTTP_200_OK)


        expected_data = OpenQuestionSerializer([question1, question2], many=True).data
        self.assertEqual(response.data, expected_data)


class TestOpenQuestionViewSet(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.client.force_authenticate(user=self.user)

    def test_list_open_questions(self):
        question1 = OpenQuestion.objects.create(title='Pregunta 1', description='Descripción 1')
        question2 = OpenQuestion.objects.create(title='Pregunta 2', description='Descripción 2')

        response = self.client.get(reverse('open-questions-list'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = OpenQuestionSerializer([question1, question2], many=True).data
        self.assertEqual(response.data, expected_data)

    def test_retrieve_open_question(self):
        question = OpenQuestion.objects.create(title='Pregunta 1', description='Descripción 1')

        response = self.client.get(reverse('open-questions-detail', args=[question.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = OpenQuestionSerializer(question).data
        self.assertEqual(response.data, expected_data)

    def test_create_open_question(self):
        data = {'title': 'Nueva Pregunta', 'description': 'Nueva Descripción'}

        response = self.client.post(reverse('open-questions-list'), data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(OpenQuestion.objects.count(), 1)

        created_question = OpenQuestion.objects.get()
        self.assertEqual(created_question.title, data['title'])
        self.assertEqual(created_question.description, data['description'])

    def test_update_open_question(self):
        question = OpenQuestion.objects.create(title='Pregunta 1', description='Descripción 1')
        updated_data = {'title': 'Pregunta Actualizada', 'description': 'Descripción Actualizada'}

        response = self.client.put(reverse('open-questions-detail', args=[question.id]), updated_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        question.refresh_from_db()
        self.assertEqual(question.title, updated_data['title'])
        self.assertEqual(question.description, updated_data['description'])

    def test_delete_open_question(self):
        question = OpenQuestion.objects.create(title='Pregunta a Eliminar', description='Descripción a Eliminar')

        response = self.client.delete(reverse('open-questions-detail', args=[question.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(OpenQuestion.objects.count(), 0)
