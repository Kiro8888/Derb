const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get('form_id');
class FormManager {
    constructor() {


        this.formPreview = document.getElementById('form-preview');
        this.customFormContainer = document.getElementById('custom-form-container');
        this.textareasContainer = document.getElementById('textareas-container');
        this.myForm = document.getElementById('miFormulario');
        this.btnSubmit = document.getElementById('form_submit');
        this.openQuestionElement = document.getElementById('openQuestion');
        this.records = [];
        this.myForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.openQuestionElement.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.formPreview.addEventListener('dragover', this.handleDragOver.bind(this));
        this.formPreview.addEventListener('drop', this.handleDrop.bind(this));
        this.btnSubmit.addEventListener('click', this.handleFormSubmit.bind(this));

        this.myForm.addEventListener('click', (event) => {
            event.preventDefault();
        });

        this.myForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }


async handleFormSubmit(event) {
    event.preventDefault();

    try {
      for (const formData of this.records) {
           await this.sendDataToAPI(formData);
           await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const urlParts = window.location.pathname.split('/');
        const formId = urlParts[urlParts.length - 2];

        // Obtiene las preguntas actuales del formulario
        const currentQuestionsResponse = await fetch(`/api/form/${formId}/`);
        if (!currentQuestionsResponse.ok) {
            throw new Error('Failed to fetch the current questions in the form');
        }
        const currentQuestionsData = await currentQuestionsResponse.json();

        // Obtiene todas las preguntas disponibles
        const allQuestionsResponse = await fetch('/api/open-questions/');
        if (!allQuestionsResponse.ok) {
            throw new Error('Failed to fetch the list of questions');
        }
        const allQuestionsData = await allQuestionsResponse.json();

        // Combina las preguntas actuales con las nuevas preguntas
        const currentQuestionIds = currentQuestionsData.questions_form || [];
        const newQuestionIds = this.records.map(formData => {
            const question = allQuestionsData.find(item => item.title === formData.title);
            return question ? question.id : null;
        });

        // Combina las listas de preguntas sin duplicados
        const updatedQuestionIds = [...new Set([...currentQuestionIds, ...newQuestionIds])];

        const dataToUpdate = {
            questions_form: updatedQuestionIds
        };

        // Realiza una solicitud PUT para actualizar el formulario con todas las preguntas
        const putResponse = await fetch(`/api/form/${formId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        });

        if (putResponse.ok) {
            console.log('Field "questions_form" updated successfully');
        } else {
            console.error('Failed to update the "questions_form" field');
        }
    } catch (error) {
        console.error('Error fetching questions or updating the form:', error);
    }
}

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', 'openQuestion');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const itemType = e.dataTransfer.getData('text/plain');

        if (itemType === 'openQuestion') {
            const customForm = document.createElement('div');
            customForm.className = 'custom-form';

            const titleInput = this.createInput('Title');
            const descriptionInput = this.createInput('Description');
            const placeholderInput = this.createInput('Placeholder');
            const helpInput = this.createInput('Help');
            const saveButton = this.createButton('Save');

            saveButton.addEventListener('click', () => {
                const formData = {
                    title: titleInput.value,
                    description: descriptionInput.value,
                    placeholder: placeholderInput.value,
                    help: helpInput.value
                };

                formData.list_order = this.records.length + 1;
                this.records.push(formData);

                console.log(formData);

                this.clearFields(titleInput, descriptionInput, placeholderInput, helpInput, saveButton);

               // const textareaContainer = this.createTextareaContainer(formData);

                //this.textareasContainer.appendChild(textareaContainer);
                // this.sendDataToAPI(formData);
                const event = new Event('submit');
                // Llama a la función handleFormSubmit
                this.handleFormSubmit(event);

                setTimeout(() => {
        window.location.reload();
    }, 1500); // 2000 milisegundos (2 segundos)

            });

            customForm.appendChild(titleInput);
            customForm.appendChild(descriptionInput);
            customForm.appendChild(placeholderInput);
            customForm.appendChild(helpInput);
            customForm.appendChild(saveButton);

            this.customFormContainer.appendChild(customForm);
        }

    }

    createInput(placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        return input;
    }

    createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        return button;
    }

    clearFields(...fields) {
        fields.forEach(field => {
            field.value = '';
            field.style.display = 'none';
        });
    }

    findIndexOfContainer(textareaContainer) {
        return Array.from(this.textareasContainer.children).indexOf(textareaContainer);
    }

    swapContainers(indexA, indexB) {
        const temp = this.records[indexA];
        this.records[indexA] = this.records[indexB];
        this.records[indexB] = temp;

        const containerA = this.textareasContainer.children[indexA];
        const containerB = this.textareasContainer.children[indexB];
        this.textareasContainer.insertBefore(containerA, containerB);
    }

    updateListOrderValues() {
        this.records.forEach((record, index) => {
            record.list_order = index + 1;
        });
    }

    sendDataToAPI(formData) {
        fetch('/api/open-questions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Data sent successfully to the API');
            } else {
                console.error('Failed to send data to the API');
            }
        })
        .catch(error => {
            console.error('Error sending data to the API:', error);
        });
    }
}
/////////////////////////CARGAR LAS PREGUNTAS EN EL FORM

function Up(pregunta) {
    console.log('list_order UP:', pregunta.list_order);

    if (pregunta.list_order > -1) {
        // Realiza una solicitud PUT para cambiar la posición de la pregunta
        const serverUrl = `/api/open-questions/${pregunta.id}/`; // Reemplaza con tu URL de la API
        fetch(serverUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ list_order: pregunta.list_order - 2, title: pregunta.title })
        })
        .then(response => {
            if (response.ok) {
                console.log('La posición de la pregunta se ha actualizado con éxito en el servidor');
                // Actualiza la representación visual de las preguntas
                setTimeout(() => {
                    window.location.reload(); // Recargar la página
                }, 1500); // 1500 milisegundos = 1.5 segundos

            } else {
                console.error('Error al actualizar la posición de la pregunta en el servidor');
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud PUT:', error);
        });
    } else {
        console.log('No se puede restar más, límite mínimo alcanzado.');
    }
}

function Down(pregunta) {
    console.log('list_order DW:', pregunta.list_order);

    // Realiza una solicitud PUT para cambiar la posición de la pregunta
    const serverUrl = `/api/open-questions/${pregunta.id}/`; // Reemplaza con tu URL de la API
    fetch(serverUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list_order: pregunta.list_order + 2, title: pregunta.title })
    })
    .then(response => {
        if (response.ok) {
            console.log('La posición de la pregunta se ha actualizado con éxito en el servidor');
            // Actualiza la representación visual de las preguntas
            setTimeout(() => {
                window.location.reload(); // Recargar la página
            }, 1500); // 1500 milisegundos = 1.5 segundos

// Obtén la pregunta con el valor de list_order más alto
fetch('/api/open-questions/', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        // Ordena las preguntas por list_order en orden descendente
        data.sort((a, b) => b.list_order - a.list_order);

        // La primera pregunta en la lista será la última (la más alta)
        const lastQuestion = data[0];
        if (lastQuestion) {
            console.log('Pregunta con el list_order más alto:', lastQuestion);
        }
    })
    .catch(error => {
        console.error('Error al obtener la pregunta con el list_order más alto:', error);
    });

        } else {
            console.error('Error al actualizar la posición de la pregunta en el servidor');
        }
    })
    .catch(error => {
        console.error('Error al enviar la solicitud PUT:', error);
    });
}






async function updateIcon(pregunta) {
const preguntaId = pregunta.id;
    try {
        // Obtén los datos actuales de la pregunta desde tu API
        const response = await fetch(`/api/open-questions/${preguntaId}/`);
        if (!response.ok) {
            console.error('Error al obtener los datos de la pregunta');
            return;
        }
        const preguntaData = await response.json();

        // Crear elementos input para la edición
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = preguntaData.title;

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.value = preguntaData.description;

        const placeholderInput = document.createElement('input');
        placeholderInput.type = 'text';
        placeholderInput.value = preguntaData.placeholder;

        const helpInput = document.createElement('input');
        helpInput.type = 'text';
        helpInput.value = preguntaData.help;

        // Botón para guardar los cambios
        const saveChangesButton = document.createElement('button');
        saveChangesButton.textContent = 'Save Changes';
        saveChangesButton.classList.add('blue-button');

        // Evento para guardar los cambios
        saveChangesButton.addEventListener('click', async () => {
            // Obtén los valores editados de los campos de entrada
            const editedData = {
                title: titleInput.value,
                description: descriptionInput.value,
                placeholder: placeholderInput.value,
                help: helpInput.value
            };

            // Realiza una solicitud PUT con los datos editados a tu API
            const putResponse = await fetch(`/api/open-questions/${preguntaId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedData)
            });

            if (putResponse.ok) {
                console.log('Pregunta actualizada exitosamente');
                // Espera 2 segundos y luego recarga la página
        setTimeout(() => {
            window.location.reload();
        }, 1500);
            } else {
                console.error('Error al actualizar la pregunta');
            }
        });

        // Agregar los elementos al formulario de edición
        const customForm = document.getElementById('miFormulario'); // Reemplaza con el ID correcto
        customForm.innerHTML = ''; // Limpia el contenido anterior
        customForm.appendChild(titleInput);
        customForm.appendChild(descriptionInput);
        customForm.appendChild(placeholderInput);
        customForm.appendChild(helpInput);
        customForm.appendChild(saveChangesButton);

    } catch (error) {
        console.error('Error al obtener los datos de la pregunta:', error);
    }
}




function deleteQuestion(pregunta, preguntaDiv, preguntaId) {
    const confirmDelete = confirm('¿Seguro que deseas eliminar esta pregunta?');
    if (!confirmDelete) {
        return; // Si el usuario cancela la eliminación, no hagas nada
    }

    // Realizar la solicitud DELETE a la API utilizando el ID de la pregunta
    fetch(`/api/open-questions/${preguntaId}/`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                console.log('Pregunta eliminada exitosamente');
                // Elimina el textarea del formulario en el cliente
                const textareaElement = preguntaDiv.querySelector('textarea');
                if (textareaElement) {
                    textareaElement.remove();
                }
            } else {
                console.error('Error al eliminar la pregunta');
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud DELETE:', error);
        });

    // Luego de eliminar el textarea, también puedes eliminar la preguntaDiv si es necesario
    preguntaDiv.remove();
}


function loadform() {
    const formId = window.location.pathname.split('/').filter(Boolean).pop();
    console.log('formId:', formId);

    if (formId) {
        fetch(`/api/form/${formId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el formulario.');
                }
                return response.json();
            })
            .then(async formulario => {
                const textareasContainer = document.getElementById('textareas-container');
                const formDiv = document.createElement('div');
                formDiv.className = 'formulario';

                const titleform = document.createElement('h2');
                titleform.textContent = formulario.title_form;

                const descriptionform = document.createElement('p');
                descriptionform.textContent = formulario.title_description;

                formDiv.appendChild(titleform);
                formDiv.appendChild(descriptionform);

                const questionsData = await Promise.all(formulario.questions_form.map(async preguntaId => {
                    const response = await fetch(`/api/open-questions/${preguntaId}/`);
                    if (!response.ok) {
                        throw new Error('No se pudo cargar la pregunta.');
                    }
                    return response.json();
                }));

                // Ordena las preguntas por list_order
                questionsData.sort((a, b) => a.list_order - b.list_order);

                questionsData.forEach(pregunta => {
                             console.log('ID de la pregunta:', pregunta.id, 'title',pregunta.title, 'list_order', pregunta.list_order);

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

                    preguntaDiv.appendChild(tituloPregunta);
                    preguntaDiv.appendChild(descripcionPregunta);
                    preguntaDiv.appendChild(textareaElement);

                    // DELETE
                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('fas', 'fa-trash', 'icon');
                    deleteIcon.setAttribute('data-question-id', pregunta.id); // Almacena el ID de la pregunta
                    deleteIcon.addEventListener('click', () => {
                        this.deleteQuestion(pregunta, preguntaDiv, pregunta.id); // Pasa el ID de la pregunta
                    });
                    preguntaDiv.appendChild(deleteIcon);

                    // UPDATE
                    const updateIcon = document.createElement('i');
                    updateIcon.classList.add('fas', 'fa-edit', 'icon');
                    updateIcon.setAttribute('data-question-id', pregunta.id); // Almacena el ID de la pregunta
                    updateIcon.addEventListener('click', async () => {
                        console.log('ACTUALIZANDO', pregunta.id)
                        const customForm = document.getElementById('custom-form'); // Asegúrate de utilizar el ID correcto
                        this.updateIcon(pregunta);
                    });
                    preguntaDiv.appendChild(updateIcon);

                    // HELP
                    const helpIcon = document.createElement('i');
                    helpIcon.classList.add('fas', 'fa-question-circle', 'icon');
                    helpIcon.setAttribute('data-question-id', pregunta.id); // Almacena el ID de la pregunta
                    helpIcon.addEventListener('click', async () => {
                        console.log('AYUDA', pregunta.id)
                        Swal.fire({
                            title: 'Help',
                            text: pregunta.help,
                            icon: 'info',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log('Confirm Ok');
                            }
                        });
                    });
                    preguntaDiv.appendChild(helpIcon);

                    // UP
                    const upIcon = document.createElement('i');
                    upIcon.classList.add('fas', 'fa-arrow-up', 'icon');
                    upIcon.addEventListener('click', function() {
                        console.log('list_order:', pregunta.list_order);
                        Up(pregunta);
                    }.bind(this));

                    preguntaDiv.appendChild(upIcon);

                    // DOWN
                    const downIcon = document.createElement('i');
                    downIcon.classList.add('fas', 'fa-arrow-down', 'icon');
                    downIcon.addEventListener('click', function() {
                        console.log('list_order:', pregunta.list_order);
                        Down(pregunta);
                    }.bind(this));

                    preguntaDiv.appendChild(downIcon);

                    formDiv.appendChild(preguntaDiv);

                    const hrElement = document.createElement('hr');
                    formDiv.appendChild(hrElement);
                });

                textareasContainer.appendChild(formDiv);
            })
            .catch(error => console.error('Error al cargar el formulario:', error));
    } else {
        console.error('Formulario ID no proporcionado en la URL.');
    }
}

/////////////////////////CARGAR LAS PREGUNTAS EN EL FORM

new FormManager();
window.addEventListener('load', () => {
    console.log('hola');
    loadform(formId);
});