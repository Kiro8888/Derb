import pytest
from django.urls import reverse

from open_question.models import OpenQuestion, Response, Form
from django.contrib.auth.models import User
import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from open_question.models import OpenQuestion

@pytest.mark.django_db
def test_create_open_question():
    question = OpenQuestion.objects.create(
        title="Test Question",
        description="Test Description",
        placeholder="Test Placeholder",
        help="Test Help",
        list_order=1
    )
    assert question.title == "Test Question"
    assert question.list_order == 1

@pytest.mark.django_db
def test_create_response():
    question = OpenQuestion.objects.create(title="Test Question")
    user = User.objects.create(username="testuser")
    response = Response.objects.create(
        response="Test Response",
        questions=question,
        user=user
    )
    assert response.response == "Test Response"
    assert response.user == user


@pytest.mark.django_db
def test_api_create_open_question():
    client = APIClient()
    user = User.objects.create(username='testuser')
    client.force_authenticate(user=user)

    data = {
        'title': 'New Test Question',
        'description': 'New Test Description',
        'placeholder': 'New Test Placeholder',
        'help': 'New Test Help',
        'list_order': 1
    }
    response = client.post(reverse('open-questions-list'), data, format='json')

    assert response.status_code == 201
    assert OpenQuestion.objects.count() == 1
