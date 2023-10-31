const formSubmitButton = document.getElementById('form_submit');
const formularioUser = document.getElementById('formulario-user');
const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get('form_id');

    function loadform() {
    const formId = window.location.pathname.split('/').filter(Boolean).pop();

    if (formId) {
        fetch(`/api/form/2/`)
            .then(response => {
                if (!response.ok) {

                }
                return response.json();
            })
            .then(formulario => {
                const textareasContainer = document.getElementById('textareas-container');


                const formDiv = document.createElement('div');
                formDiv.className = 'formulario';

                const titleform = document.createElement('h2');
                titleform.textContent = formulario.title_form;

                const descriptionform = document.createElement('p');
                descriptionform.textContent = formulario.title_description;


                formDiv.appendChild(titleform);
                formDiv.appendChild(descriptionform);


                formulario.questions_form.forEach(preguntaId => {

                    fetch(`/api/open-questions/${preguntaId}/`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('No se pudo cargar la pregunta.');
                            }
                            return response.json();
                        })
                        .then(pregunta => {
                            const preguntaDiv = document.createElement('div');
                            preguntaDiv.className = 'pregunta';

                            const tituloPregunta = document.createElement('h3');
                            tituloPregunta.textContent = pregunta.title;

                            const descripcionPregunta = document.createElement('p');
                            descripcionPregunta.textContent = pregunta.description;


                            const textareaElement = document.createElement('textarea');
                            textareaElement.placeholder = pregunta.placeholder;
                            textareaElement.style.width = '100%';
                            textareaElement.style.height = '200px';


                            textareaElement.setAttribute('data-question-id', pregunta.id);
                            loadform

                            preguntaDiv.appendChild(tituloPregunta);
                            preguntaDiv.appendChild(descripcionPregunta);
                            preguntaDiv.appendChild(textareaElement);


                            formDiv.appendChild(preguntaDiv);
                        })
                        .catch(error => console.error('Error al cargar la pregunta:', error));
                });

                textareasContainer.appendChild(formDiv);
            })
            .catch(error => console.error('Error al cargar el formulario:', error));
    } else {
        console.error('Formulario ID no proporcionado en la URL.');
    }
}


function sendresponse() {
    const textareas = document.querySelectorAll('#textareas-container textarea');

    textareas.forEach((textarea) => {
        const preguntaID = +textarea.getAttribute('data-question-id');
        const respuesta = textarea.value;


        const respuestaActual = {
            "questions": preguntaID,
            "response": respuesta
        };


        fetch('/api/response-questions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(respuestaActual)
        })
        .then(response => {
            if (response.ok) {
                console.log('Datos enviados con éxito a la API de respuestas');
            } else {
                throw new Error('Error al enviar los datos a la API de respuestas.');
            }
        })
        .catch(error => console.error(error.message));
    });
}


formSubmitButton.addEventListener('click', function (event) {
    event.preventDefault();
    sendresponse();
});

window.addEventListener('load', () => {
    loadform(formId);
});