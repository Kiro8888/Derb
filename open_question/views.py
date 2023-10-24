from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json

from django.views.decorators.csrf import csrf_exempt

from open_question.models import OpenQuestion, Response


from django.shortcuts import render, redirect

from .models import Form

from django.shortcuts import render
from .models import Form, OpenQuestion
import requests


def mi_vista(request):
    return render(request, 'home.html')


def update_form(request, form_id):
    if request.method == 'PUT':
        try:
            form = Form.objects.get(id=form_id)
        except Form.DoesNotExist:
            return JsonResponse({'error': 'El formulario no existe'}, status=404)
        return JsonResponse({'message': 'Formulario actualizado con éxito'}, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)



def open_question_list(request, form_id):
    form = Form.objects.get(id=form_id)

    if request.method == 'POST':
        pregunta = request.POST.get('pregunta')
        descripcion_pregunta = request.POST.get('descripcion_pregunta')
        placeholder_pregunta = request.POST.get('placeholder_pregunta')
        help_pregunta = request.POST.get('help_pregunta')
        nueva_pregunta = OpenQuestion(
            title=pregunta,
            description=descripcion_pregunta,
            placeholder=placeholder_pregunta,
            help=help_pregunta
        )
        nueva_pregunta.save()
        form.questions_form.add(nueva_pregunta)

        preguntas_creadas = [nueva_pregunta]

    else:
        preguntas_creadas = form.questions_form.all()

    return render(request, 'open_question_list.html', {'form': form, 'preguntas_creadas': preguntas_creadas})


def fetch_form_api(preguntas_creadas):
    api_url = "/api/form/"
    payload = {
        "preguntas_creadas": preguntas_creadas
    }

    response = requests.post(api_url, json=payload)

    if response.status_code == 200:
        data = response.json()
        print(data)
    else:
        print("Error al hacer la solicitud a la API de form")

    fetch_form_api(preguntas_creadas)

def form(request):
    if request.method == 'POST':
        title_form = request.POST.get('title_form')
        title_description = request.POST.get('title_description')

        nuevo_formulario = Form(
            title_form=title_form,
            title_description=title_description
        )
        nuevo_formulario.save()
        return redirect('open_list', form_id=nuevo_formulario.id)
    nuevo_formulario = Form()

    return render(request, 'create_form.html',{'nuevo_formulario': nuevo_formulario})

def user_response(request):
    return render(request, 'open_question_user.html')

