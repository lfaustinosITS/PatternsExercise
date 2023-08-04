export {formatDate,createTemplate1,createTemplate2};


function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes} hours`;
}

//List of Notes
function createTemplate1(note) {
    if (!note) {
        return null; // Retorna null si note es undefined
      }
    const formattedNoteText = note.text.replace(/"/g, '')
                                       .replace(/\\n/g, '<br>')
                                       .replace(/\\t/g,'&#9;');
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);    
    const template = document.createElement('div');
    template.classList.add('template1');
    template.innerHTML = `
        <div class="resume" data-id="${note.number}">
        <h2>${note.title}</h2>
        <div class="datefield"><strong>Created:</strong> ${dateCreated}</div>
        <div class="datefield"><strong>Last Modified:</strong> ${dateModified}</div>
        <p>${formattedNoteText}</p>
        <button class="seeNote">See Note</button>
        </div>
    `;

    return template;
}

//One note
function createTemplate2(note) {
    const newNoteClass = document.getElementById('newsNote');
    if (newNoteClass.style.display === 'block') {
        newNoteClass.style.display = 'none';}
    const formattedNoteText = note.text.replace(/"/g, '')
                                       .replace(/\\n/g, '<br>')
                                       .replace(/\\t/g,'&#9;');
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);    
    const template = document.createElement('div');
    template.classList.add('template2');
    template.innerHTML = `
        <div class="resume">
            <h2>${note.title}</h2>
            <div class="datefield"><strong>Created:</strong> ${dateCreated}</div>
            <div class="datefield"><strong>Last Modified:</strong> ${dateModified}</div>
            ${formattedNoteText}
            <br>    
            <a href="#" id="backLink">Back to List</a></br></br>
            <button type="button" id = "deletethisNote">Delete Note</button>
            <button type="button" id = "editElement">Edit Note</button>
        </div>
    `;
    return template;
}