const formSubmitButton = document.getElementById('form_submit');

// Función para cargar preguntas desde la API
function cargarPreguntas() {
    fetch('/api/open-questions/')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de preguntas.');
            }
            return response.json();
        })
        .then(data => {
            const textareasContainer = document.getElementById('textareas-container');

            data.forEach(pregunta => {
                const preguntaDiv = document.createElement('div');
                preguntaDiv.className = 'pregunta';

                const tituloPregunta = document.createElement('h3');
                tituloPregunta.textContent = pregunta.title;

                const descripcionPregunta = document.createElement('p');
                descripcionPregunta.textContent = pregunta.description;

                // Crear el textarea y asignar el ID de la pregunta como atributo de datos
                const textareaElement = document.createElement('textarea');
                textareaElement.placeholder = pregunta.placeholder;
                textareaElement.style.width = '100%';
                textareaElement.style.height = '200px';

                // Asignar el ID de la pregunta como atributo de datos
                textareaElement.setAttribute('data-question-id', pregunta.id);

                // Descripción
                const descriptionDiv = document.createElement('div');
                descriptionDiv.textContent = pregunta.description;

                const downButton = document.createElement('button');
                downButton.textContent = 'Bajar';
                downButton.addEventListener('click', () => {
                    // Agrega aquí la lógica para mover la pregunta hacia abajo
                });

                // Agregar elementos al contenedor
                preguntaDiv.appendChild(tituloPregunta);
                preguntaDiv.appendChild(descripcionPregunta);
                preguntaDiv.appendChild(textareaElement);
                preguntaDiv.appendChild(descriptionDiv);

                textareasContainer.appendChild(preguntaDiv);
            });
        })
        .catch(error => console.error('Error al cargar las preguntas:', error));
}

function enviarDatosALaAPIRespuestas() {
    const datosRespuestas = {};

    const textareas = document.querySelectorAll('#textareas-container textarea');

    textareas.forEach((textarea) => {
        const preguntaID = +textarea.getAttribute('data-question-id');

        datosRespuestas[preguntaID] = {
            "response": textarea.value,
            "questions": preguntaID
        };
    });

    console.log('Datos a enviar:', JSON.stringify(datosRespuestas));

    fetch('/api/response-questions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosRespuestas)
    })
    .then(response => {
        if (response.ok) {
            console.log('Datos enviados con éxito a la API de respuestas');
        } else {
            throw new Error('Error al enviar los datos a la API de respuestas.');
        }
    })
    .catch(error => console.error(error.message));
}




formSubmitButton.addEventListener('click', function (event) {
    event.preventDefault();
    enviarDatosALaAPIRespuestas();
});

window.addEventListener('load', cargarPreguntas);
