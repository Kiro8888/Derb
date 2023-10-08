// Obtener elementos principales
const formPreview = document.getElementById('form-preview');
const customFormContainer = document.getElementById('custom-form-container');
const textareasContainer = document.getElementById('textareas-container');
const miFormulario = document.getElementById('miFormulario');

// Event listener para el formulario
miFormulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('form-preview').value;
    const description = document.getElementById('form-preview').value;
    const placeholder = document.getElementById('form-preview').value;
    const help = document.getElementById('form-preview').value;


});

// Event listener para el elemento 'openQuestion'
const openQuestionElement = document.getElementById('openQuestion');
openQuestionElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'openQuestion');
});

// Event listeners para el área de 'formPreview'
formPreview.addEventListener('dragover', (e) => {
    e.preventDefault();
});

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
        customForm.appendChild(titleInput);

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.placeholder = 'Description';
        customForm.appendChild(descriptionInput);

        const placeholderInput = document.createElement('input');
        placeholderInput.type = 'text';
        placeholderInput.placeholder = 'Placeholder';
        customForm.appendChild(placeholderInput);

        const helpInput = document.createElement('input');
        helpInput.type = 'text';
        helpInput.placeholder = 'Help';
        customForm.appendChild(helpInput);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';
        saveButton.addEventListener('click', () => {
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

            // Aquí agregamos el código para ocultar los campos de entrada
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

            // Crear un nuevo textarea con los datos ingresados
            const textareaElement = document.createElement('textarea');
            textareaElement.placeholder = formData.placeholder;
            textareaElement.setAttribute('data-description', formData.description);
            textareaElement.style.width = '100%';
            textareaElement.style.height = '200px';

            // Agregar el textarea al contenedor en "textareasContainer"
            textareasContainer.appendChild(textareaElement);

            // Limpiar los campos después de guardar
            titleInput.value = '';
            descriptionInput.value = '';
            placeholderInput.value = '';
            helpInput.value = '';
        });
        customForm.appendChild(saveButton);

        customFormContainer.appendChild(customForm);
    }
});
