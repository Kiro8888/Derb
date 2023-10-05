
from django.contrib import admin
from django.urls import path, include
from djgentelella.urls import urlpatterns as djgentelellaurls
from open_question.views import mi_vista, form, save_model_data, load_model_data, open_question_list
from rest_framework.routers import DefaultRouter

from open_question.viewset import OpenQuestionViewSet, ResponseQuestionViewSet

router = DefaultRouter()
router.register(r'open-questions', OpenQuestionViewSet)
router.register(r'response-questions', ResponseQuestionViewSet)


urlpatterns = djgentelellaurls + [
    path('', mi_vista, name='home'),
    path('form/', form, name='form'),
    path('api/', include(router.urls)),
    path('save-data/', save_model_data, name='save-data'),
    path('load-data/', load_model_data, name='load-data'),
    path('open_list/', open_question_list, name='open_question_list')
]
