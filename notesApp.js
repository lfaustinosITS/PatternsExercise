import { handleDrop, handleDragOver } from "./dragAndDrop.js";
import { loadNotes, loadSearch } from "./loadNotes.js";
import { saveNote, restoreNotesFromHistory } from "./actionsOnNotes.js";


//New Note Field
const currentDate = new Date();


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



//Initialize App
function initializeApp() {
    const storedNotes = localStorage.getItem('notes');
    let changesHistory;
    let Notes;
    if (storedNotes) {
        Notes = JSON.parse(storedNotes);
    } else {
        Notes = [];
        localStorage.setItem('notes', JSON.stringify(Notes));
    }
    const storedHistory = localStorage.getItem('history');
    if (storedHistory) {
        changesHistory = JSON.parse(storedHistory);
    } else {
        changesHistory = [];
        localStorage.setItem('history', JSON.stringify(changesHistory));
    }

    loadNotes();

}

initializeApp()

noteContainer.addEventListener('dragover', handleDragOver);
noteContainer.addEventListener('drop', handleDrop);