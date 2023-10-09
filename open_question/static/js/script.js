class FormManager {
    constructor() {
        this.formPreview = document.getElementById('form-preview');
        this.customFormContainer = document.getElementById('custom-form-container');
        this.textareasContainer = document.getElementById('textareas-container');
        this.miFormulario = document.getElementById('miFormulario');
        this.btn_submit = document.getElementById('form_submit');
        this.openQuestionElement = document.getElementById('openQuestion');


         // Declarar las variables como propiedades de la clase
            this.registros = [];

        this.miFormulario.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.openQuestionElement.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.formPreview.addEventListener('dragover', this.handleDragOver.bind(this));
        this.formPreview.addEventListener('drop', this.handleDrop.bind(this));
        this.btn_submit.addEventListener('click', this.handleFormSubmit.bind(this));

             this.miFormulario.addEventListener('click', (event) => {
            event.preventDefault(); // Evita la recarga de la página

        });

    }


    handleFormSubmit(event) {
        event.preventDefault();
        const titleInput = this.createInput('Title');
        const descriptionInput = this.createInput('Description');
        const placeholderInput = this.createInput('Placeholder');
        const helpInput = this.createInput('Help');

        // Acceder a los valores de los elementos de entrada
        const titleValue = titleInput.value;
        const descriptionValue = descriptionInput.value;
        const placeholderValue = placeholderInput.value;
        const helpValue = helpInput.value;

        // Realizar acciones adicionales con los valores
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
            // Crear un formulario personalizado y agregarlo a 'customFormContainer'
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

                 // Agregar el formData al array de registros
                this.registros.push(formData);


                console.log(formData);


                // LIMPIAR CAMPOS INPUT DEL SETTINGS
                this.clearFields(titleInput, descriptionInput, placeholderInput, helpInput, saveButton);

                // Crear un nuevo div para contener el título y la descripción
                const textareaContainer = this.createTextareaContainer(formData);

                // Agregar el contenedor al contenedor de textareas
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

        // Crear textarea y otros elementos aquí

        // Textarea
        const textareaElement = document.createElement('textarea');
        textareaElement.placeholder = formData.placeholder;
        textareaElement.setAttribute('data-description', formData.description);
        textareaElement.style.width = '100%';
        textareaElement.style.height = '200px';

        // Descripción
        const descriptionDiv = document.createElement('div');
        descriptionDiv.textContent = formData.description;

        /////////////BOTON DE SUBIR Y BAJAR
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
        //////////////////////////////////

        // Agregar elementos al contenedor
        textareaContainer.appendChild(titleDiv);
        textareaContainer.appendChild(textareaElement);
        textareaContainer.appendChild(descriptionDiv);
        textareaContainer.appendChild(upButton);
        textareaContainer.appendChild(downButton);

        // Agregar el contenedor al contenedor de textareas
        this.textareasContainer.appendChild(textareaContainer);

        return textareaContainer;
    }

    moveUp(textareaContainer) {
        const prevTextareaContainer = textareaContainer.previousElementSibling;
        if (prevTextareaContainer) {
            textareaContainer.parentNode.insertBefore(textareaContainer, prevTextareaContainer);
        }
    }

    moveDown(textareaContainer) {
        const nextTextareaContainer = textareaContainer.nextElementSibling;
        if (nextTextareaContainer) {
            textareaContainer.parentNode.insertBefore(nextTextareaContainer, textareaContainer);
        }
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

        handleFormSubmit(event) {
        event.preventDefault();
        console.log('Se hizo clic en el botón');

  for (const formData of this.registros) {
            this.enviarDatosALaAPI(formData);
        }


    }
}

new FormManager();
