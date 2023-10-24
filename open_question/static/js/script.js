class FormManager {
    constructor() {

        this.formPreview = document.getElementById('form-preview');
        this.customFormContainer = document.getElementById('custom-form-container');
        this.textareasContainer = document.getElementById('textareas-container');
        this.miFormulario = document.getElementById('miFormulario');
        this.btn_submit = document.getElementById('form_submit');
        this.openQuestionElement = document.getElementById('openQuestion');


        this.registros = [];


        this.miFormulario.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.openQuestionElement.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.formPreview.addEventListener('dragover', this.handleDragOver.bind(this));
        this.formPreview.addEventListener('drop', this.handleDrop.bind(this));
        this.btn_submit.addEventListener('click', this.handleFormSubmit.bind(this));

        this.miFormulario.addEventListener('click', (event) => {
            event.preventDefault();
        });

          this.miFormulario.addEventListener('submit', this.handleFormSubmit.bind(this));
    }


async handleFormSubmit(event) {
    event.preventDefault();




    try {
         for (const formData of this.registros) {
            this.enviarDatosALaAPI(formData );
        }

    const urlParts = window.location.pathname.split('/');
    const formId = urlParts[urlParts.length - 2];



        const response = await fetch('/api/open-questions/');
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de preguntas');
        }
        const data = await response.json();

        const registrosNoEliminados = this.registros.filter(formData => formData !== null);
        const preguntasActualizar = registrosNoEliminados.map(formData => {
            const pregunta = data.find(item => item.title === formData.title);
            if (pregunta) {
                return pregunta.id;
            }
            return null;
        });

        const datosActualizar = {
            questions_form: preguntasActualizar
        };

        const putResponse = await fetch(`/api/form/${formId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizar)
        });

        if (putResponse.ok) {
            console.log('Campo "questions_form" actualizado con éxito');
        } else {
            console.error('Error al actualizar el campo "questions_form"');
        }
    } catch (error) {
        console.error('Error al obtener preguntas o al actualizar el formulario:', error);
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
            const saveButton = this.createButton('Guardar');

            saveButton.addEventListener('click', () => {
                const formData = {
                    title: titleInput.value,
                    description: descriptionInput.value,
                    placeholder: placeholderInput.value,
                    help: helpInput.value
                };

                formData.list_order = this.registros.length + 1;
                this.registros.push(formData);

                console.log(formData);

                this.clearFields(titleInput, descriptionInput, placeholderInput, helpInput, saveButton);


                const textareaContainer = this.createTextareaContainer(formData);


                this.textareasContainer.appendChild(textareaContainer);

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

    createTextareaContainer(formData) {
        const textareaContainer = document.createElement('div');
        const titleDiv = document.createElement('div');
        titleDiv.textContent = formData.title;

        const textareaElement = document.createElement('textarea');
        textareaElement.placeholder = formData.placeholder;
        textareaElement.setAttribute('data-description', formData.description);
        textareaElement.style.width = '100%';
        textareaElement.style.height = '200px';


        const descriptionDiv = document.createElement('div');
        descriptionDiv.textContent = formData.description;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => {
        this.deleteTextareaContainer(textareaContainer);
    });



const updateButton = document.createElement('button');
updateButton.textContent = 'Actualizar';
updateButton.addEventListener('click', () => {
    this.editQuestion(formData, textareaContainer);
});


        const upButton = document.createElement('button');
        upButton.textContent = 'Subir';
        upButton.addEventListener('click', () => {
            this.moveUp(textareaContainer);
        });

        const downButton = document.createElement('button');
        downButton.textContent = 'Bajar';
        downButton.addEventListener('click', () => {
            this.moveDown(textareaContainer);
        });



        textareaContainer.appendChild(titleDiv);
        textareaContainer.appendChild(textareaElement);
        textareaContainer.appendChild(descriptionDiv);
        textareaContainer.appendChild(deleteButton);
        textareaContainer.appendChild(updateButton);
        textareaContainer.appendChild(upButton);
        textareaContainer.appendChild(downButton);


        this.textareasContainer.appendChild(textareaContainer);

        return textareaContainer;
    }

editQuestion(formData, textareaContainer) {

    const updateButton = textareaContainer.querySelector('button');
    updateButton.disabled = true;


    const textareaElement = textareaContainer.querySelector('textarea');
    const titleInput = this.createInput('Title');
    titleInput.value = formData.title;
    const descriptionInput = this.createInput('Description');
    descriptionInput.value = formData.description;
    const placeholderInput = this.createInput('Placeholder');
    placeholderInput.value = formData.placeholder;
    const helpInput = this.createInput('Help');
    helpInput.value = formData.help;


    const currentInputs = textareaContainer.querySelectorAll('input');
    currentInputs.forEach(input => input.remove());
    textareaContainer.insertBefore(titleInput, textareaElement);
    textareaContainer.insertBefore(descriptionInput, textareaElement);
    textareaContainer.insertBefore(placeholderInput, textareaElement);
    textareaContainer.insertBefore(helpInput, textareaElement);

    const saveButton = this.createButton('Guardar');
    textareaContainer.insertBefore(saveButton, textareaElement);

    saveButton.addEventListener('click', () => {

        formData.title = titleInput.value;
        formData.description = descriptionInput.value;
        formData.placeholder = placeholderInput.value;
        formData.help = helpInput.value;


        textareaElement.value = formData.description;


        titleInput.remove();
        descriptionInput.remove();
        placeholderInput.remove();
        helpInput.remove();
        saveButton.remove();
        updateButton.disabled = true;
    });
}


 deleteTextareaContainer(textareaContainer) {

    const index = this.findIndexOfContainer(textareaContainer);

    if (index !== -1) {

        this.registros.splice(index, 1);


        this.textareasContainer.removeChild(textareaContainer);

   
        this.updateListOrderValues();
    }
}

    moveUp(textareaContainer) {
        const index = this.findIndexOfContainer(textareaContainer);
        if (index > 0) {
            const prevIndex = index - 1;
            this.swapContainers(index, prevIndex);
            this.updateListOrderValues();
        }
    }

    moveDown(textareaContainer) {
        const index = this.findIndexOfContainer(textareaContainer);
        if (index < this.registros.length - 1) {
            const nextIndex = index + 1;
            this.swapContainers(index, nextIndex);
            this.updateListOrderValues();
        }
    }

    findIndexOfContainer(textareaContainer) {
        return Array.from(this.textareasContainer.children).indexOf(textareaContainer);
    }

    swapContainers(indexA, indexB) {
        const temp = this.registros[indexA];
        this.registros[indexA] = this.registros[indexB];
        this.registros[indexB] = temp;

        const containerA = this.textareasContainer.children[indexA];
        const containerB = this.textareasContainer.children[indexB];
        this.textareasContainer.insertBefore(containerA, containerB);
    }

    updateListOrderValues() {
        this.registros.forEach((registro, index) => {
            registro.list_order = index + 1;
        });
    }

    enviarDatosALaAPI(formData) {
        fetch('/api/open-questions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Datos enviados con éxito a la API');
            } else {
                console.error('Error al enviar los datos a la API');
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos a la API:', error);
        });
    }
}

new FormManager();
