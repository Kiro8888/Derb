from django.shortcuts import render
from django.http import JsonResponse
import json
from open_question.models import OpenQuestion

# Create your views here.
def mi_vista(request):
    return render(request, 'home.html')

def form(request):
    return render(request, 'form.html')


def save_data_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)



def load_data_from_json(filename):
    with open(filename, 'r') as json_file:
        return json.load(json_file)


def save_model_data(request):
    data_to_save = list(OpenQuestion.objects.values())  # Aquí obtienes los datos de tus modelos
    save_data_to_json(data_to_save, 'datos.json')
    return JsonResponse({'message': 'Datos guardados en JSON'})


def load_model_data(request):
    loaded_data = load_data_from_json('datos.json')

    # Añade el parámetro safe=False para permitir objetos no diccionarios
    return JsonResponse(loaded_data, safe=False)
