const basicElementsContainer = document.getElementById('basic-elements');
const formPreview = document.getElementById('form-preview');
const openQuestionModal = document.getElementById('openQuestionModal');
const closeModalButton = document.getElementById('closeModal');
const formularioContenido = document.getElementById('formulario-contenido');

document.getElementById('miFormulario').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const placeholder = document.getElementById('placeholder').value;
    const help = document.getElementById('help').value;

    limpiarCamposModal();
const titleElement = document.createElement('div');
titleElement.textContent = title;
titleElement.style.fontWeight = 'bold';


   const textField = document.createElement('textarea');
textField.placeholder = placeholder;
textField.setAttribute('data-description', description);
textField.style.width = '100%';
textField.style.height = '200px';



const descriptionElement = document.createElement('div');
descriptionElement.textContent = description;


formularioContenido.appendChild(titleElement);
formularioContenido.appendChild(textField);
formularioContenido.appendChild(descriptionElement);

    formularioContenido.appendChild(textField);
    openQuestionModal.style.display = 'none';

    const formData = {
        title: title,
        description: description,
        placeholder: placeholder,
        help : help
    };

    // POST a API
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
});

const openQuestionElement = document.getElementById('openQuestion');
openQuestionElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'openQuestion');
});

formPreview.addEventListener('dragover', (e) => {
    e.preventDefault();
});

formPreview.addEventListener('drop', (e) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('text/plain');

    if (itemType === 'openQuestion') {
        openQuestionModal.style.display = 'block';
    }
});

function limpiarCamposModal() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('placeholder').value = '';
    document.getElementById('help').value = '';
}

closeModalButton.addEventListener('click', () => {
    limpiarCamposModal();
    openQuestionModal.style.display = 'none';
});
