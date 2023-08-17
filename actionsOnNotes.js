import { loadNotes } from "./loadNotes.js";
export { saveEditedNote, saveNote, editNote, searchNotes, deleteNote, saveHistory, restoreNotesFromHistory, createIndexSearch };



//Save History
const storedHistory = localStorage.getItem('history');
let changesHistory = JSON.parse(storedHistory);

function saveHistory(array) {
    changesHistory.push(array);
    localStorage.setItem('history', JSON.stringify(changesHistory));

}
//Restore Notes
function restoreNotesFromHistory() {
    if (changesHistory.length > 0) {
        let Notes = changesHistory[changesHistory.length - 1];
        changesHistory.pop();
        localStorage.setItem('notes', JSON.stringify(Notes));
        localStorage.setItem('history', JSON.stringify(changesHistory));
    }
}

//SaveNote
function saveNote() {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteText = document.getElementById('note').value;
    const currentDate = new Date();
    const noteTitle = document.getElementById('title').value;
    if (noteText == '' || noteTitle == '') {
        return;
    }
    const newNote = {
        number: Notes.length,
        created: currentDate,
        lastModified: currentDate,
        title: noteTitle,
        text: noteText
    };
    const notesCopy = JSON.parse(JSON.stringify(Notes));
    saveHistory(notesCopy);
    Notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(Notes));
    document.getElementById('title').value = "";
    document.getElementById('note').value = "";
}

//Delete Note
function deleteNote(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const index = Notes.findIndex(note => note.number === parseInt(noteId));
    if (index !== -1) {
        saveHistory(Notes);
        Notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(Notes));

    }
    loadNotes();
}
//Edit Note
function editNote(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const note = Notes[noteIndex];
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

//Save Edited Note
function saveEditedNote(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const editTitle = document.getElementById('editTitle').value;
    const editNote = document.getElementById('editNote').value;
    if (noteIndex !== -1) {
        Notes[noteIndex].title = editTitle;
        Notes[noteIndex].text = editNote;
        Notes[noteIndex].lastModified = new Date();
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes();
    }
}
//Search
function createIndexSearch() {
    const storedNotes = localStorage.getItem('notes');
    const Notes = JSON.parse(storedNotes);
    const indexSearch = {};

    for (let i = 0; i < Notes.length; i++) {
        for (let item of Notes[i].text.match(/\b\w+\b/g)) {
            if (!indexSearch[item]) {
                indexSearch[item] = [];
            }
            if (!indexSearch[item].includes(i)) {
                indexSearch[item].push(i);
            }
        }
    }

    return indexSearch;
}

function searchNotes(word) {
    const indexSearchL = createIndexSearch()
    if (word in indexSearchL) {
        return indexSearchL[word];
    } else {
        return [];
    }

}