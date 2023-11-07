import pytest
from open_question.models import OpenQuestion, Response, Form
from django.contrib.auth.models import User


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
