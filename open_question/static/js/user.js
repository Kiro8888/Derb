class FormApp {
  constructor() {
    this.formSubmitButton = document.getElementById('form_submit');
    this.formularioUser = document.getElementById('formulario-user');
    this.urlParams = new URLSearchParams(window.location.search);
    this.formId = this.urlParams.get('form_id');

    this.formSubmitButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.sendResponse();
    });

    window.addEventListener('load', () => {
      this.loadForm();
    });
  }

  loadForm() {
    const formId = window.location.pathname.split('/').filter(Boolean).pop();
    console.log(formId);

    if (formId) {
      fetch(`/api/form/${formId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se pudo cargar el formulario.');
          }
          return response.json();
        })
        .then(async (formulario) => {
          this.displayForm(formulario);
        })
        .catch((error) => console.error('Error al cargar el formulario:', error));
    } else {
      console.error('Formulario ID no proporcionado en la URL.');
    }
  }

  displayForm(formulario) {
    const textareasContainer = document.getElementById('textareas-container');
    const formDiv = document.createElement('div');
    formDiv.className = 'formulario';

    const titleForm = document.createElement('h2');
    titleForm.textContent = formulario.title_form;

    const descriptionForm = document.createElement('p');
    descriptionForm.textContent = formulario.title_description;

    formDiv.appendChild(titleForm);
    formDiv.appendChild(descriptionForm);

    const preguntaIds = formulario.questions_form;

    Promise.all(preguntaIds.map(async (preguntaId) => {
      const response = await fetch(`/api/open-questions/${preguntaId}/`);
      if (!response.ok) {
        throw new Error('No se pudo cargar la pregunta.');
      }
      return response.json();
    })
    ).then((preguntas) => {
      preguntas.sort((a, b) => a.list_order - b.list_order);
      preguntas.forEach((pregunta) => {
        this.displayQuestion(pregunta, formDiv);
      });

      textareasContainer.appendChild(formDiv);
    }).catch((error) => console.error('Error al cargar las preguntas:', error));
  }

  displayQuestion(pregunta, formDiv) {
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


//VAMOS A ELIMINAR ESTO
  /*  const sendButton = document.createElement('button');
    sendButton.textContent = 'Edit';
    sendButton.addEventListener('click', () => {
        const preguntaId = pregunta.id;
        console.log('ID de la pregunta', preguntaId);
        this.getResponseIdForQuestion(preguntaId)
          .then((respuestaId) => {
            console.log('Respuesta id:', respuestaId);
            if (respuestaId !== null) {
              this.checkOwnershipAndLoadModal(respuestaId, textareaElement);
            } else {
              console.error('No se encontró una respuesta para la pregunta con ID', preguntaId);
            }
          });
    });*/
//VAMOS A ELIMINAR ESTO
    textareaElement.style.width = '100%';
    textareaElement.style.height = '200px';

    const help = document.createElement('button');
    help.textContent = 'Help';
    help.addEventListener('click', () => {
      Swal.fire({
        title: 'Help',
        text: pregunta.help,
        icon: 'info',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Confirm OK');
        }
      });
    });

// CARGAR RESPUESTAS
console.log('ID de la sesión activa: ', userId);
fetch('/api/response-questions/')
  .then((response) => {
    if (!response.ok) {
      throw new Error('No se pudieron cargar las respuestas.');
    }
    return response.json();
  })
  .then((respuestas) => {
    console.log('ID DE LA RESPUESTA: ', respuestas);
    const respuestasUsuario = respuestas.filter((respuesta) => respuesta.user === userId);
    respuestasUsuario.forEach((respuesta) => {
      const preguntaId = respuesta.questions;
      const textareaElement = document.querySelector(`textarea[data-question-id="${preguntaId}"]`);
      if (textareaElement) {
        textareaElement.value = respuesta.response;
        textareaElement.readOnly = false;
      }
    });
  })
  .catch((error) => {
    console.error('Error al cargar las respuestas:', error);
  });

// CARGAR RESPUESTAS


    preguntaDiv.appendChild(tituloPregunta);
    preguntaDiv.appendChild(descripcionPregunta);
    preguntaDiv.appendChild(textareaElement);
    //preguntaDiv.appendChild(sendButton);
    preguntaDiv.appendChild(help);

    formDiv.appendChild(preguntaDiv);
  }

 /*getResponseIdForQuestion(preguntaId) {
    return fetch('/api/response-questions/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar las respuestas.');
        }
        return response.json();
      })
      .then((respuestas) => {
        const respuestaEncontrada = respuestas.find((respuesta) => respuesta.questions === preguntaId && respuesta.user === userId);
        return respuestaEncontrada ? respuestaEncontrada.id : null;
      })
      .catch((error) => {
        console.error('Error al cargar las respuestas:', error);
        return null;
      });
}*/


checkOwnershipAndLoadModal(respuestaId, textareaElement) {
    fetch(`/api/response-questions/${respuestaId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la respuesta.');
            }
            return response.json();
        })
        .then((respuesta) => {
            if (respuesta.user === userId) {
                console.log('El usuario actual es el propietario de la respuesta.');
                this.loadResponseDataAndOpenModal(respuestaId, textareaElement);
            } else {
                console.error('El usuario no tiene permisos para editar esta respuesta.');
            }
        })
        .catch((error) => console.error('Error al cargar la respuesta:', error));
}

  sendResponse() {
    const textareas = document.querySelectorAll('#textareas-container textarea');

    textareas.forEach((textarea) => {
      const preguntaID = +textarea.getAttribute('data-question-id');
      const respuesta = textarea.value;

      if (respuesta.trim() !== '') {
        const respuestaActual = {
          questions: preguntaID,
          response: respuesta,
          user: userId
        };
        const csrftoken = this.getCookie('csrftoken');

        fetch('/api/response-questions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify(respuestaActual)
        })
          .then((response) => {
            if (response.ok) {
              console.log('Datos enviados con éxito a la API de respuestas');
                          setTimeout(() => {
              window.location.reload();
            }, 500);
            } else {
              throw new Error('Error al enviar los datos a la API de respuestas.');
            }
          })
          .catch((error) => console.error(error.message));
      }
    });
  }
loadResponseDataAndOpenModal(respuestaId, textareaElement) {
  fetch(`/api/response-questions/${respuestaId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('No se pudo cargar la respuesta.');
      }
      return response.json();
    })
    .then((respuesta) => {
      console.log('Respuesta obtenida:', respuesta.response);
      textareaElement.value = respuesta.response;
      this.createModal(respuestaId);
      this.openModal();
    })
    .catch((error) => console.error('Error al cargar la respuesta:', error));
}

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  /*createModal(respuestaId) {
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Update Response';

    const textareaElement = document.createElement('textarea');
    textareaElement.style.width = '100%';
    textareaElement.style.height = '200px';

    fetch(`/api/response-questions/${respuestaId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la respuesta.');
        }
        return response.json();
      })
      .then((respuesta) => {
        textareaElement.value = respuesta.response;
      })
      .catch((error) => console.error('Error al cargar la respuesta:', error));

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      const nuevaRespuesta = textareaElement.value;

      fetch(`/api/response-questions/${respuestaId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se pudo cargar la respuesta existente.');
          }
          return response.json();
        })
        .then((respuesta) => {
          respuesta.response = nuevaRespuesta;
          const csrfToken = this.getCookie('csrftoken');

          return fetch(`/api/response-questions/${respuestaId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(respuesta)
          });
        })
        .then((response) => {
          if (response.ok) {
            console.log('Respuesta actualizada con éxito');
            this.closeAndRemoveModal();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            throw new Error('Error al actualizar la respuesta.');
          }
        })
        .catch((error) => console.error(error.message));
    });

    const closeModalButton = document.createElement('span');
    closeModalButton.className = 'close';
    closeModalButton.textContent = '×';
    closeModalButton.onclick = this.closeAndRemoveModal;

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(textareaElement);
    modalContent.appendChild(closeModalButton);
    modalContent.appendChild(updateButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }

  closeAndRemoveModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';

    modal.parentNode.removeChild(modal);
  }*/
}

new FormApp();
