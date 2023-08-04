import { handleDragStart, handleDragOver, handleDrop } from "./dragAndDrop.js";
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
    const formattedNoteText = note.text.replace(/"/g, '')
        .replace(/\\n/g, '<br>')
        .replace(/\\t/g, '&#9;');
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const template = document.createElement('div');
    template.className = 'listTemplate';
    template.id = note.number;
    template.innerHTML = `
        <div class="resume">
        <h2>${note.title}</h2>
        <div class="datefield"><strong>Created:</strong> ${dateCreated}</div>
        <div class="datefield"><strong>Last Modified:</strong> ${dateModified}</div>
        <br>
        <p>${formattedNoteText}</p>
        <br><br>
        <button class="seeNote">See Note</button>
        </div>
    `;
    template.draggable = true;
    template.addEventListener('dragstart', handleDragStart);
    template.addEventListener('dragover', handleDragOver);
    template.querySelectorAll('*').forEach(element => {
        element.removeEventListener('drop', handleDrop);
    });

    // Add drop event
    template.addEventListener('drop', handleDrop);




    return template;
}

//Single Note
function singleNote(note) {
    const newNoteClass = document.getElementById('newNote');
    if (newNoteClass.style.display === 'block') {
        newNoteClass.style.display = 'none';
    }
    const formattedNoteText = note.text.replace(/"/g, '')
        .replace(/\\n/g, '<br>')
        .replace(/\\t/g, '&#9;');
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const template = document.createElement('div');
    template.classList.add('singleNoteTemplate');
    template.innerHTML = `
        <h2>${note.title}</h2>
        <div class="datefield"><strong>Created:</strong> ${dateCreated}</div>
        <div class="datefield"><strong>Last Modified:</strong> ${dateModified}</div>
        <br>
        ${formattedNoteText}
        <br><br>    
        <a href="#" id="backLink">Back to List</a></br></br>
        <button type="button" id = "deletethisNote">Delete Note</button>
        <button type="button" id = "editElement">Edit Note</button>
    `;
    return template;
}