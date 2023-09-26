
from django.contrib import admin
from django.urls import path
from djgentelella.urls import urlpatterns as djgentelellaurls
from open_question.views import mi_vista


urlpatterns = djgentelellaurls + [
    path('', mi_vista, name='home'),
]
