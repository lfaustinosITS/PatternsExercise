import { loadNotes } from "./loadNotes.js";
export { saveEditedNote, saveNote, editNote, searchNotes, deleteNote, saveHistory, restoreNotesFromHistory };

const storedNotes = localStorage.getItem('notes');
let Notes = JSON.parse(storedNotes);

//Save History
const storedHistory = localStorage.getItem('history');
let changesHistory = JSON.parse(storedHistory);

function saveHistory(array) {
    changesHistory.push(array);
    localStorage.setItem('history', JSON.stringify(changesHistory));
    console.log(changesHistory);

}
//Restore Notes
function restoreNotesFromHistory() {
    if (changesHistory.length > 0) {
        Notes = changesHistory[changesHistory.length - 1];
        changesHistory.pop();
        localStorage.setItem('notes', JSON.stringify(Notes));
        localStorage.setItem('history', JSON.stringify(changesHistory));
    }
}

//SaveNote
function saveNote() {
    event.preventDefault();
    const noteText = document.getElementById('note').value;
    const formattedText = JSON.stringify(noteText);
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
        text: formattedText
    };
    const notesCopy = JSON.parse(JSON.stringify(Notes));
    saveHistory(notesCopy);
    Notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(Notes));
    document.getElementById('title').value = "";
    document.getElementById('note').value = "";
    loadNotes(Notes);
}

//Delete Note
function deleteNote(noteId) {
    const index = Notes.findIndex(note => note.number === noteId);
    if (index !== -1) {
        saveHistory(Notes);
        Notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes(Notes);
    }
}
//Edit Note
function editNote(note) {
    const noteContainer = document.getElementById('noteContainer');
    noteContainer.innerHTML = '';
    const formattedText = note.text.replace(/"/g, '')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '&#9;');
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <input type="text" id="editTitle" value="${note.title}"></br></br>
        <textarea type="text" id="editNote" class="editable-field">${formattedText}</textarea></br></br>
        <button type="button" id="saveEdit" >Save Changes</button>
        <button type="button" id="back">Back</button>

    `;
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
    const backButton = document.getElementById("back");
    const saveEditButton = document.getElementById("saveEdit");
    backButton.addEventListener('click', function () { loadNotes(Notes) });
    saveEditButton.addEventListener('click', function () { saveEditedNote(note.number) })

}

//Save Edited Note
function saveEditedNote(noteId) {
    const editTitle = document.getElementById('editTitle').value;
    const editNote = document.getElementById('editNote').value;
    const formattedText = JSON.stringify(editNote);
    const index = Notes.findIndex(note => note.number === noteId);
    if (index !== -1) {
        saveHistory(Notes);
        Notes[index].title = editTitle;
        Notes[index].text = formattedText;
        Notes[index].lastModified = new Date();
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes(Notes);
    }
}
//Search
function createIndexSearch() {
    const indexSearch = [];
    for (let i = 0; i < Notes.length; i++) {
        for (let item of Notes[i].text.match(/\b\w+\b/g)) {
            if (item in indexSearch) {
                indexSearch[item].push(i)
            } else {
                indexSearch[item] = [i];
            }
        }
    }
    return indexSearch
}
function searchNotes(word) {
    const indexSearchL = createIndexSearch()
    if (word in indexSearchL) {
        return indexSearchL[word];
    } else {
        return [];
    }

}