    const formSubmitButton = document.getElementById('form_submit');
    const formularioUser = document.getElementById('formulario-user');
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('form_id');
    function loadform() {
        const formId = window.location.pathname.split('/').filter(Boolean).pop();
        console.log(formId);

        if (formId) {
            fetch(`/api/form/${formId}/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo cargar el formulario.');
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
                        // Asumiendo que preguntaId es una Promesa que se resuelve con el ID de la pregunta
                        Promise.resolve(preguntaId)
                            .then(resolvedPreguntaId => {
                                fetch(`/api/open-questions/${resolvedPreguntaId}`)
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

                                        textareaElement.setAttribute('data-question-id', resolvedPreguntaId);


                                        const sendButton = document.createElement('button');
                                        sendButton.textContent = 'Edit';

                                        // Agregar un manejador de eventos al botón para enviar la respuesta
                                            sendButton.addEventListener('click', function () {
                                                getResponseIdForQuestion(resolvedPreguntaId)
                                                    .then(respuestaId => {
                                                        if (respuestaId !== null) {
                                                            console.log('ID de respuesta:', respuestaId);
                                                            fetch(`/api/response-questions/${respuestaId}`)
                                                                .then(response => {
                                                                    if (!response.ok) {
                                                                        throw new Error('No se pudo cargar la respuesta.');
                                                                    }
                                                                    return response.json();
                                                                })
                                                                .then(respuesta => {
                                                                    console.log('Respuesta obtenida:', respuesta.response);
                                                                    textareaElement.value = respuesta.response;
                                                                    textareaElement.readOnly = true;
                                                                    createModal(respuestaId); // Crea el modal
                                                                    openModal(); // Muestra el modal
                                                                })
                                                                .catch(error => console.error('Error al cargar la respuesta:', error));
                                                        } else {
                                                            // Manejar el caso en que no se encuentra una respuesta
                                                            console.error('No se encontró una respuesta para la pregunta con ID', resolvedPreguntaId);
                                                        }
                                                    });
                                            });

                                            textareaElement.style.width = '100%';
                                            textareaElement.style.height = '200px';


                                        // Luego, obtén el ID de respuesta con la función
                                        getResponseIdForQuestion(resolvedPreguntaId)
                                            .then(respuestaId => {
                                                if (respuestaId !== null) {
                                                    fetch(`/api/response-questions/${respuestaId}`)
                                                        .then(response => {
                                                            if (!response.ok) {
                                                                throw new Error('No se pudo cargar la respuesta.');
                                                            }
                                                            return response.json();
                                                        })
                                                        .then(respuesta => {
                                                            console.log('Respuesta obtenida:', respuesta.response);
                                                            textareaElement.value = respuesta.response;
                                                            textareaElement.readOnly = true;
                                                        })
                                                        .catch(error => console.error('Error al cargar la respuesta:', error));
                                                } else {
                                                    // Manejar el caso en que no se encuentra una respuesta
                                                    console.error('No se encontró una respuesta para la pregunta con ID', resolvedPreguntaId);
                                                }
                                            });

                                        preguntaDiv.appendChild(tituloPregunta);
                                        preguntaDiv.appendChild(descripcionPregunta);
                                        preguntaDiv.appendChild(textareaElement);
                                        preguntaDiv.appendChild(sendButton);


                                        formDiv.appendChild(preguntaDiv);
                                    })
                                    .catch(error => console.error('Error al cargar la pregunta:', error));
                            });
                    });

                    textareasContainer.appendChild(formDiv);
                })
                .catch(error => console.error('Error al cargar el formulario:', error));
        } else {
            console.error('Formulario ID no proporcionado en la URL.');
        }
    }

    function getResponseIdForQuestion(preguntaId) {
        return fetch('/api/response-questions/') // Realiza una solicitud a la API de respuestas
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las respuestas.');
                }
                return response.json();
            })
            .then(respuestas => {
                const respuestaEncontrada = respuestas.find(respuesta => respuesta.questions === preguntaId);
                return respuestaEncontrada ? respuestaEncontrada.id : null;
            })
            .catch(error => {
                console.error('Error al cargar las respuestas:', error);
                return null; // Manejar el error de la solicitud
            });
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

    function getResponseIds() {
        fetch('/api/response-questions/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las respuestas.');
                }
                return response.json();
            })
            .then(respuestas => {
                // Itera a través de las respuestas y muestra los IDs en el console.log
                respuestas.forEach(respuesta => {
                    console.log('ID de respuesta:', respuesta.id);
                });
            })
            .catch(error => console.error('Error al cargar las respuestas:', error));
    }
    //CREATE MODAL

    function createModal(respuestaId) {
      // Crea el elemento del modal
      const modal = document.createElement('div');
      modal.id = 'myModal';
      modal.className = 'modal';

      // Crea el contenido del modal
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';

      // Agrega el título
      const modalTitle = document.createElement('h2');
      modalTitle.textContent = 'Update Response';

      // Crea un nuevo textarea
      const textareaElement = document.createElement('textarea');
      textareaElement.style.width = '100%';
      textareaElement.style.height = '200px';

      // Obtén la respuesta correspondiente al respuestaId y colócala en el textarea
      fetch(`/api/response-questions/${respuestaId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo cargar la respuesta.');
          }
          return response.json();
        })
        .then(respuesta => {
          textareaElement.value = respuesta.response;
          //textareaElement.readOnly = true;
        })
        .catch(error => console.error('Error al cargar la respuesta:', error));

        // Crea un botón de actualización
      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      // Obtén la nueva respuesta del textarea
      const nuevaRespuesta = textareaElement.value;

      // Obtén la respuesta actual de la API
      fetch(`/api/response-questions/${respuestaId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la respuesta existente.');
        }
        return response.json();
      })
      .then(respuesta => {
        // Actualiza el campo 'response' de la respuesta
        respuesta.response = nuevaRespuesta;

        // Envía una solicitud PUT para actualizar la respuesta
        return fetch(`/api/response-questions/${respuestaId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(respuesta)
        });
      })
      .then(response => {
        if (response.ok) {
          console.log('Respuesta actualizada con éxito');
          closeAndRemoveModal(); // Cierra el modal después de actualizar
        } else {
          throw new Error('Error al actualizar la respuesta.');
        }
      })
      .catch(error => console.error(error.message));
    });



      // Agrega un botón de cierre
      const closeModalButton = document.createElement('span');
      closeModalButton.className = 'close';
      closeModalButton.textContent = '×';
      closeModalButton.onclick = closeAndRemoveModal;


      // Agrega elementos al contenido del modal
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(textareaElement); // Agrega el textarea al contenido del modal
      modalContent.appendChild(closeModalButton);
       modalContent.appendChild(updateButton);

      // Agrega el contenido del modal al modal
      modal.appendChild(modalContent);

      // Agrega el modal al documento
      document.body.appendChild(modal);
    }


    function openModal() {
      const modal = document.getElementById('myModal');
      modal.style.display = 'block';
    }

    function closeAndRemoveModal() {
      const modal = document.getElementById('myModal');
      modal.style.display = 'none';
      // Remueve el modal del documento
      modal.parentNode.removeChild(modal);
    }

    formSubmitButton.addEventListener('click', function (event) {
        event.preventDefault();
        sendresponse();
    });

    window.addEventListener('load', () => {
        loadform(formId);
        //    getResponseIds();
    });