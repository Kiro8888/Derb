import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from open_question.models import Form

@pytest.mark.django_db
def test_mi_vista(client):
    response = client.get(reverse('home'))
    assert response.status_code == 200

@pytest.mark.django_db
def test_form_view(client):
    user = User.objects.create_user(username="testuser", password="testpassword")
    client.login(username="testuser", password="testpassword")
    response = client.get(reverse('form'))
    assert response.status_code == 200

