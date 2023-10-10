from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from djgentelella.urls import urlpatterns as djgentelellaurls
from open_question.urls import urlpatterns as url

def home(request):
    return HttpResponse('OK')

urlpatterns = djgentelellaurls + [

    path('admin/', admin.site.urls),
    path('', include('open_question.urls')),
] + url
