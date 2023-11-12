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



@pytest.mark.django_db
def test_open_question_list_view(client):
    form = Form.objects.create(title_form="Test Form")
    response = client.get(reverse('open_list', kwargs={'form_id': form.id}))
    assert response.status_code == 200


@pytest.mark.django_db
def test_user_response_view(client):
    form = Form.objects.create(title_form="Test Form")
    response = client.get(reverse('user_response', kwargs={'form_id': form.id}), follow=True)

    assert response.status_code == 200
    assert response.redirect_chain[-1][0].startswith(
        reverse('login'))

    assert 'next=/response/1/' in response.redirect_chain[-1][0]

