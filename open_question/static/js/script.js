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
                this.sendDataToAPI(formData);
            }

            const urlParts = window.location.pathname.split('/');
            const formId = urlParts[urlParts.length - 2];

            const response = await fetch('/api/open-questions/');
            if (!response.ok) {
                throw new Error('Failed to fetch the list of questions');
            }
            const data = await response.json();

            const nonDeletedRecords = this.records.filter(formData => formData !== null);
            const questionsToUpdate = nonDeletedRecords.map(formData => {
                const question = data.find(item => item.title === formData.title);
                if (question) {
                    return question.id;
                }
                return null;
            });

            const dataToUpdate = {
                questions_form: questionsToUpdate
            };

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

        const deleteIcon = document.createElement('i');
deleteIcon.classList.add('fas', 'fa-trash', 'icon');

deleteIcon.addEventListener('click', () => {
    this.deleteTextareaContainer(textareaContainer);
});

const updateIcon = document.createElement('i');
updateIcon.classList.add('fas', 'fa-edit','icon');

updateIcon.addEventListener('click', () => {
    this.editQuestion(formData, textareaContainer);
});

const upIcon = document.createElement('i');
upIcon.classList.add('fas', 'fa-arrow-up','icon');

upIcon.addEventListener('click', () => {
    this.moveUp(textareaContainer);
});

const downIcon = document.createElement('i');
downIcon.classList.add('fas', 'fa-arrow-down', 'icon');

downIcon.addEventListener('click', () => {
    this.moveDown(textareaContainer);
});


const helpIcon = document.createElement('i');
helpIcon.classList.add('fas', 'fa-question-circle', 'icon');
helpIcon.addEventListener('click', () => {
    Swal.fire({
        title: 'Help',
        text: formData.help,
        icon: 'info',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('Confirm Ok');
        }
    });
});



        textareaContainer.appendChild(titleDiv);
        textareaContainer.appendChild(textareaElement);
        textareaContainer.appendChild(descriptionDiv);
        textareaContainer.appendChild(deleteIcon);
        textareaContainer.appendChild(updateIcon);
        textareaContainer.appendChild(upIcon);
        textareaContainer.appendChild(downIcon);
        textareaContainer.appendChild(helpIcon);

        this.textareasContainer.appendChild(textareaContainer);

        return textareaContainer;
    }

    editQuestion(formData, textareaContainer) {
        const updateIcon = textareaContainer.querySelector('button');
        //updateIcon.disabled = true;

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

        const saveButton = this.createButton('Save');
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
            //updateButton.disabled = true;
        });
    }

    deleteTextareaContainer(textareaContainer) {
        const index = this.findIndexOfContainer(textareaContainer);

        if (index !== -1) {
            this.records.splice(index, 1);
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
        if (index < this.records.length - 1) {
            const nextIndex = index + 1;
            this.swapContainers(index, nextIndex);
            this.updateListOrderValues();
        }
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

new FormManager();
