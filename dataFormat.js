import { navigateToItem,loadNotes } from "./loadNotes.js";
import { handleDragStart, handleDragOver, handleDrop } from "./dragAndDrop.js";
import { deleteNote,editNote } from "./actionsOnNotes.js";

export { listOfNotes, singleNote };

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
//List of Notes
function listOfNotes(note) {
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const noteTemplate = document.querySelector('#noteTemplate');
    const clon = noteTemplate.content.cloneNode(true);
    clon.querySelector('.noteDisplayed').id = note.number
    clon.querySelector('article').draggable = true;
    clon.querySelector('article').setAttribute('data-id',note.number);
    clon.querySelector('article').addEventListener('dragstart', function (event){
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
    noteArticle.draggable=false;
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