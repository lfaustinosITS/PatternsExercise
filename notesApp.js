import {saveNote,deleteNote, createIndexSearch} from "./actionsOnNotes.js";
import {loadNotes,loadSearch} from "./loadNotes.js";


//New Note Field
const showNewButton = document.getElementById('showNew');
showNewButton.addEventListener('click', function() {
    const newNoteClass = document.getElementById('newsNote');
    if (newNoteClass.style.display === 'none') {
            newNoteClass.style.display = 'block';
    } else {
            newNoteClass.style.display = 'none';
    }
});
const editableFields = document.querySelectorAll('.editable-field');
editableFields.forEach(field => {
    field.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const { selectionStart, selectionEnd } = this;
        this.value = this.value.substring(0, selectionStart) + '\t' + this.value.substring(selectionEnd);
        this.selectionStart = this.selectionEnd = selectionStart + 1;
    }
    });
});


const noteContainer = document.getElementById('noteContainer');
noteContainer.addEventListener('drop', dropHandler);


const saveButton = document.getElementById('newNote');
saveButton.addEventListener('click', function(){saveNote();loadNotes()});

//Default Note
let currentDate = new Date();
let Notes = [{
    "created": currentDate,
    "lastModified": currentDate,
    "title": "Note one",
    "text": "Welcome to Note App"
},];

const searchButton = document.getElementById('buttonSearch');
searchButton.addEventListener('click', function()
        {const searchedWord = document.getElementById('searchWord').value; 
        console.log(searchedWord); 
        loadSearch(searchedWord)});



//Initialize App
function initializeApp() {
    const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            Notes = JSON.parse(storedNotes);
        } else {
            Notes = [{
                "number":0,
                "created": currentDate,
                "lastModified": currentDate,
                "title": "Note one",
                "text": "Welcome to Note App"
            }];
            localStorage.setItem('notes', JSON.stringify(Notes));
        }
        console.log(Notes.length);
    loadNotes();
}

initializeApp()