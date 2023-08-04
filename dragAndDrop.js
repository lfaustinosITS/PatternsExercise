import { loadNotes } from "./loadNotes.js";
import { saveHistory } from "./actionsOnNotes.js";
export { clearContainer, handleDragOver, handleDragStart, handleDrop };

const noteContainer = document.getElementById('noteContainer')
const storedNotes = localStorage.getItem('notes');
let Notes = JSON.parse(storedNotes);
const divs = [];

function reorderNotes(notes, originalIndex, newIndex) {

    const noteToMove = notes.splice(originalIndex, 1)[0];
    notes.splice(newIndex, 0, noteToMove);
}
for (const key in Notes) {
    if (Notes.hasOwnProperty(key)) {
        const note = Notes[key];
        divs.push(note.number);
    }
}

function clearContainer() {
    noteContainer.innerHTML = '';
    divs.length = 0;
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    console.log(event.target.id);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const noteId = parseInt(event.dataTransfer.getData('text/plain'));
    const noteElement = document.getElementById(noteId);
    const originalIndex = divs.indexOf(noteId);
    const newIndex = divs.indexOf(parseInt(event.target.id));
    console.log(event.target, newIndex, originalIndex);
    if (originalIndex > -1 && newIndex > -1 && originalIndex !== newIndex) {
        const notesCopy = JSON.parse(JSON.stringify(Notes));
        saveHistory(notesCopy);
        reorderNotes(Notes, originalIndex, newIndex);
        clearContainer();
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes(Notes);
    }

}