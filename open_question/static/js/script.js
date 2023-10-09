// Obtener elementos principales
const formPreview = document.getElementById('form-preview');
const customFormContainer = document.getElementById('custom-form-container');
const textareasContainer = document.getElementById('textareas-container');
const miFormulario = document.getElementById('miFormulario');
const btn_submit = document.getElementById('form_submit');
const openQuestionElement = document.getElementById('openQuestion');


// Event listener para el formulario   SETTINGS
miFormulario.addEventListener('submit', function (event) {
    event.preventDefault();
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title';

    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.placeholder = 'Description';

    const placeholderInput = document.createElement('input');
    placeholderInput.type = 'text';
    placeholderInput.placeholder = 'Placeholder';

    const helpInput = document.createElement('input');
    helpInput.type = 'text';
    helpInput.placeholder = 'Help';

    // Acceder a los valores de los elementos de entrada
    const titleValue = titleInput.value;
    const descriptionValue = descriptionInput.value;
    const placeholderValue = placeholderInput.value;
    const helpValue = helpInput.value;

});



////ARRASTRAR Y SOLTAR

// Event listener para el elemento 'openQuestion'
openQuestionElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'openQuestion');
});

// Event listeners para el área de 'formPreview'
formPreview.addEventListener('dragover', (e) => {
    e.preventDefault();
});


/////////////////////////////////////////

formPreview.addEventListener('drop', (e) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('text/plain');

    if (itemType === 'openQuestion') {
        // Crear un formulario personalizado y agregarlo a 'customFormContainer'
        const customForm = document.createElement('div');
        customForm.className = 'custom-form';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.placeholder = 'Title';

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.placeholder = 'Description';

        const placeholderInput = document.createElement('input');
        placeholderInput.type = 'text';
        placeholderInput.placeholder = 'Placeholder';

        const helpInput = document.createElement('input');
        helpInput.type = 'text';
        helpInput.placeholder = 'Help';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';


        saveButton.addEventListener('click', () => {




                  ///////QUITAR, MOVER EL FETCH AL API



            // Aquí puedes agregar el código para guardar la información en tu API
            const formData = {
                title: titleInput.value,
                description: descriptionInput.value,
                placeholder: placeholderInput.value,
                help: helpInput.value
            };

            // Realizar la solicitud POST a tu API aquí
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
                    titleInput.value = '';
                    descriptionInput.value = '';
                    placeholderInput.value = '';
                    helpInput.value = '';
                    saveButton.value = '';

                    // Ocultar los campos de título y descripción
                    titleInput.style.display = 'none';
                    descriptionInput.style.display = 'none';
                    placeholderInput.style.display = 'none';
                    helpInput.style.display = 'none';
                    saveButton.style.display = 'none';
                } else {
                    console.error('Error al enviar los datos a la API');
                }
            })
            .catch(error => {
                console.error('Error al enviar los datos a la API:', error);
            });


///////////////////////////////QUITAR, MOVER EL FETCH AL API





            // Crear un nuevo div para contener el título y la descripción
            const textareaContainer = document.createElement('div');

            // Título
            const titleDiv = document.createElement('div');
            titleDiv.textContent = formData.title;

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
                moveUp(textareaContainer);
            });

            const downButton = document.createElement('button');
            downButton.textContent = 'Bajar';
            downButton.addEventListener('click', () => {
                moveDown(textareaContainer);
            });
//////////////////////////////////




            // Agregar elementos al contenedor
            textareaContainer.appendChild(titleDiv);
            textareaContainer.appendChild(textareaElement);
            textareaContainer.appendChild(descriptionDiv);
            textareaContainer.appendChild(upButton);
            textareaContainer.appendChild(downButton);

            // Agregar el contenedor al contenedor de textareas
            textareasContainer.appendChild(textareaContainer);
        });

        customForm.appendChild(titleInput);
        customForm.appendChild(descriptionInput);
        customForm.appendChild(placeholderInput);
        customForm.appendChild(helpInput);
        customForm.appendChild(saveButton);

        customFormContainer.appendChild(customForm);
    }
});


///////////////MOVER ARRIBA Y ABAJO
        // Función para mover hacia arriba
        function moveUp(textareaContainer) {
            const prevTextareaContainer = textareaContainer.previousElementSibling;
            if (prevTextareaContainer) {
                textareaContainer.parentNode.insertBefore(textareaContainer, prevTextareaContainer);
            }
        }

        // Función para mover hacia abajo
        function moveDown(textareaContainer) {
            const nextTextareaContainer = textareaContainer.nextElementSibling;
            if (nextTextareaContainer) {
                textareaContainer.parentNode.insertBefore(nextTextareaContainer, textareaContainer);
            }
        }
////////////////////////////////////////