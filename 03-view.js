import { navigateToItem, loadNotes, saveEditedNote, deleteNote, saveNote, editNote, loadSearch, putNoteInPlace, restoreNotesFromHistory } from "./02-presenter.js";

export { readFields, listOfNotes, singleNote, displayNotes, displayResults, editNoteTemplate, startEvents, readNewFields };

const formatDate = function (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes}:${seconds} hours`;
}

//Display all notes

function displayNotes(Notes) {
    const noteContainer = document.getElementById('notesContainer')
    noteContainer.innerHTML = '';
    const newNoteClass = document.getElementById('newNote');
    newNoteClass.style.display = 'none';
    const fragment = document.createDocumentFragment();
    for (const key in Notes) {
        if (Notes.hasOwnProperty(key)) {
            const note = Notes[key];
            const template1 = listOfNotes(note);
            fragment.prepend(template1);


        }
    }
    noteContainer.append(fragment);
}

//Display search results

function displayResults(results, Notes, word) {
    const messageDiv = document.getElementById('messages');
    const closeButton = document.getElementById('close');
    closeButton.classList.remove('hide');
    closeButton.addEventListener('click', () => {
        messageDiv.textContent = ''
        closeButton.classList.add('hide');
    });
    if (word.length===0){
        messageDiv.textContent = `Enter a word to search for`;
        loadNotes();
        return;
    }

    if (results.length === 0) {
        messageDiv.textContent = `No search results found for ${word}`;
        loadNotes();
        return;
    }


    const noteContainer = document.getElementById('notesContainer');
    noteContainer.innerHTML = '';
    messageDiv.textContent = `Search results for ${word}`;
    for (const key in results) {
        const note = Notes[results[key]];
        const template1 = listOfNotes(note);
        const backButton = template1.querySelector("#backButton");
        backButton.classList.remove('hide')
        backButton.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            messageDiv.textContent = ''
            closeButton.classList.add('hide');
            loadNotes();
        });

        noteContainer.prepend(template1);

    }
}

//List of Notes
function listOfNotes(note) {
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const noteTemplate = document.querySelector('#noteTemplate');
    const clon = noteTemplate.content.cloneNode(true);
    clon.querySelector('.noteDisplayed').id = note.number
    clon.querySelector('article').draggable = true;
    clon.querySelector('article').setAttribute('data-id', note.number);
    clon.querySelector('article').addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', note.number.toString());
    })
    clon.querySelector('#title').textContent = note.title;
    clon.querySelector('#created').textContent = dateCreated;
    clon.querySelector('#modified').textContent = dateModified;
    clon.querySelector('#content').textContent = note.text;
    clon.querySelector('#backButton').classList.add('hide');
    clon.querySelector('#deleteButton').classList.add('hide');
    clon.querySelector('#editButton').classList.add('hide');
    clon.querySelector('#seeNote').addEventListener('click', () => navigateToItem(note.number));
    clon.addEventListener('dragstart', handleDragStart);
    clon.addEventListener('dragover', handleDragOver);
    clon.querySelectorAll('*').forEach(element => {
        element.removeEventListener('drop', handleDrop);
    });

    // Add drop event
    clon.addEventListener('drop', handleDrop);

    return clon;
}

//Single Note
function singleNote(noteId) {
    const viewNote = document.getElementById(noteId);
    const noteArticle = viewNote.querySelector("article");
    noteArticle.draggable = false;
    noteArticle.classList.remove("listTemplate");
    noteArticle.classList.add("template2")
    viewNote.querySelector("#seeNote")
        .classList.add('hide');
    const backButton = viewNote.querySelector("#backButton");
    backButton.classList.remove('hide')
    backButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        loadNotes();
    });
    const deleteButton = viewNote.querySelector("#deleteButton");
    deleteButton.classList.remove('hide')
    deleteButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation()
        deleteNote(noteId);
        loadNotes();
    })
    const editButton = viewNote.querySelector('#editButton')
    editButton.classList.remove('hide')
    editButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        editNote(noteId);
    })

}
//Edit Note Template

function editNoteTemplate(note) {
    const noteContainer = document.getElementById('notesContainer');
    noteContainer.innerHTML = '';
    const editForm = document.createElement('form');
    const editTitleInput = document.createElement('input');
    editTitleInput.type = 'text';
    editTitleInput.id = 'editTitle';
    editTitleInput.value = note.title;
    editForm.appendChild(editTitleInput);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(document.createElement('br'));
    const editNoteTextarea = document.createElement('textarea');
    editNoteTextarea.value = note.text;
    editNoteTextarea.id = 'editNote';
    editNoteTextarea.classList.add('editable-field');
    editNoteTextarea.textContent = note.text;
    editForm.appendChild(editNoteTextarea);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(document.createElement('br'));
    const saveEditButton = document.createElement('button');
    saveEditButton.type = 'button';
    saveEditButton.id = 'saveEdit';
    saveEditButton.textContent = 'Save Changes';
    saveEditButton.addEventListener('click', function () {
        saveEditedNote(note.number);
        loadNotes();
    });
    editForm.appendChild(saveEditButton);
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.id = 'back';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', function () {
        loadNotes();
    });
    editForm.appendChild(backButton);
    noteContainer.appendChild(editForm);
    const editableField = document.getElementById('editNote');
    editableField.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = this;
            this.value = this.value.substring(0, selectionStart) + '\t' + this.value.substring(selectionEnd);
            this.selectionStart = this.selectionEnd = selectionStart + 1;
        }
    });
}

//Read field content
function readFields() {
    const titleTemplate = document.getElementById('editTitle');
    const textTemplate = document.getElementById('editNote');
    const editTitle = titleTemplate.value;
    const editNote = textTemplate.value;
    titleTemplate.value = '';
    textTemplate.value = '';
    return { title: editTitle, text: editNote }
}

function readNewFields() {
    const titleTemplate = document.getElementById('title');
    const textTemplate = document.getElementById('note');
    const editTitle = titleTemplate.value;
    const editNote = textTemplate.value;
    titleTemplate.value = '';
    textTemplate.value = '';
    return { title: editTitle, text: editNote }
}
function clearFields() {
    const editTitle = document.getElementById('title').value;
    const editNote = document.getElementById('note').value;
    editTitle.textContent = '';
    editNote.textContent = '';
}



function startEvents() {
    document.addEventListener('DOMContentLoaded', function () {
        const editableField = document.getElementById('note');
        editableField.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const { selectionStart, selectionEnd } = this;
                this.value = this.value.substring(0, selectionStart) + '\t' + this.value.substring(selectionEnd);
                this.selectionStart = this.selectionEnd = selectionStart + 1;
            }
        });

        const showNewButton = document.getElementById('showNew');
        showNewButton.addEventListener('click', function () {
            const newNoteClass = document.getElementById('newNote');
            if (newNoteClass.style.display === 'none') {
                newNoteClass.style.display = 'block';
            } else {
                newNoteClass.style.display = 'none';
            }
        });



        const noteContainer = document.getElementById('notesContainer');
        const saveButton = document.getElementById('saveNoteButton');
        saveButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation()
            saveNote();
            loadNotes();
        });

        const searchButton = document.getElementById('buttonSearch');
        searchButton.addEventListener('click', function () {
            const searchedWord = document.getElementById('searchWord').value;
            loadSearch(searchedWord);
        });
        const buttonUndo = document.getElementById('undoButton');
        buttonUndo.addEventListener('click', function () {
            restoreNotesFromHistory();
            loadNotes();
        });
        window.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 'z') {
                restoreNotesFromHistory();
                loadNotes();
            }
        });

        noteContainer.addEventListener('dragover', handleDragOver);
        noteContainer.addEventListener('drop', handleDrop);
    });
}


//Drag and drop events

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('data-id'));
}

function handleDragOver(event) {
    event.preventDefault();
}
function handleDrop(event) {
    event.preventDefault();
    const noteId = parseInt(event.dataTransfer.getData('text/plain'));
    const newIndex = parseInt(event.target.getAttribute('data-id'));
    putNoteInPlace(noteId, newIndex);

}

