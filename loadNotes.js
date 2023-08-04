import { searchNotes, editNote, deleteNote } from "./actionsOnNotes.js";
import { listOfNotes, singleNote } from "./dataFormat.js";
export { loadNotes, loadSearch };

const storedNotes = localStorage.getItem('notes');
let Notes = JSON.parse(storedNotes);

//JSON load notes
function loadNotes() {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    for (const key in Notes) {
        if (Notes.hasOwnProperty(key)) {
            const note = Notes[key];
            const template1 = listOfNotes(note);
            noteContainer.prepend(template1);
            const seeOneNote = template1.querySelector('.seeNote');
            seeOneNote.addEventListener('click', () => navigateToItem(note));
        }
    }

}

function loadSearch(word) {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    const searchResult = searchNotes(word);
    console.log(searchResult.length);
    if (searchResult.length === 0) {
        loadNotes(Notes);

    } else {
        for (const key in searchResult) {
            console.log(key);
            const note = Notes[searchResult[key]];
            const template1 = listOfNotes(note);
            noteContainer.prepend(template1);

        }
    }
}
//Navigation to single note
function navigateToItem(note) {
    const noteContainer = document.getElementById('noteContainer');
    noteContainer.innerHTML = '';
    const template2 = singleNote(note);
    noteContainer.appendChild(template2);
    const backLink = document.getElementById('backLink');
    backLink.addEventListener('click', function (event) {
        event.preventDefault();
        loadNotes(Notes);
    });
    const deleteButton = document.getElementById('deletethisNote');
    deleteButton.addEventListener('click', function () {
        deleteNote(note.number)
    });
    const editButton = document.getElementById('editElement');
    editButton.addEventListener('click', function () {
        editNote(note);
    });
}