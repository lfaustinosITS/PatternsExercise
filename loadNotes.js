import {formatDate,createTemplate1, createTemplate2} from "./dataFormat.js";
import {editNote,deleteNote,createIndexSearch,searchNotes} from "./actionsOnNotes.js";

export {loadNotes,loadSearch}

const storedNotes = localStorage.getItem('notes');
let Notes = JSON.parse(storedNotes);


//JSON load notes
function loadNotes() {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    for (const key in Notes) {
        if (Notes.hasOwnProperty(key)) {
            const note = Notes[key];
            const template1 = createTemplate1(note);
            noteContainer.prepend(template1);
            const seeOneNote = template1.querySelector('.seeNote');
            seeOneNote.addEventListener('click', () => navigateToItem(note));
            template1.draggable = true;
            template1.addEventListener('dragstart', dragStartHandler);
            template1.addEventListener('dragover', dragOverHandler);
            template1.addEventListener('drop', dropHandler);
            
        }
    }
    
}


let dragStartNote = null;

function dragStartHandler(event) {
  // Guardar la nota actual como la nota a arrastrar
  dragStartNote = event.target;
  // Establecer el tipo de datos que se va a transferir durante el arrastre
  event.dataTransfer.setData('text/plain', dragStartNote.dataset.id);
}

function dragOverHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
}

function dropHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  // Obtener el ID de la nota que se está arrastrando
  const dragNoteId = event.dataTransfer.getData('text/plain');

  // Obtener el ID de la nota sobre la cual se soltó
  const dropNoteId = event.target.dataset.id;

  // Obtener las posiciones de las notas en el array Notes
  const dragNoteIndex = Notes.findIndex(note => note.number === Number(dragNoteId));
  const dropNoteIndex = Notes.findIndex(note => note.number === Number(dropNoteId));

  // Intercambiar las notas en el array Notes
  const tempNote = Notes[dragNoteIndex];
  Notes[dragNoteIndex] = Notes[dropNoteIndex];
  Notes[dropNoteIndex] = tempNote;

  // Volver a cargar las notas para reflejar el nuevo orden
  loadNotes();
}

function loadSearch(word) {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    const searchResult = searchNotes(word);
    console.log(searchResult.length);    
    if (searchResult.length === 0) {
        loadNotes();
            
    } else {
        for (const key in searchResult) {
            console.log(key);
            const note = Notes[searchResult[key]];
            const template1 = createTemplate1(note);
            // template1.addEventListener('click', noteClick(note));
            noteContainer.prepend(template1);
            
        }
    }
}
//Navigation to single note
function navigateToItem(note) {
    const noteContainer = document.getElementById('noteContainer');
    noteContainer.innerHTML = '';
    const template2 = createTemplate2(note);
    noteContainer.appendChild(template2);
    const backLink = document.getElementById('backLink');
    backLink.addEventListener('click', function (event) {
        event.preventDefault();
        loadNotes();
    });
    const deleteButton=document.getElementById('deletethisNote');
    deleteButton.addEventListener('click', function() {
        deleteNote(note.number)});
    const editButton = document.getElementById('editElement');
    editButton.addEventListener('click', function() {
        editNote(note);
    });
}