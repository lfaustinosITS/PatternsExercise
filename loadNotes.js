import { createIndexSearch } from "./actionsOnNotes.js";
import { listOfNotes, singleNote } from "./dataFormat.js";
export { loadNotes, loadSearch, navigateToItem };


//JSON load notes
function loadNotes() {
    const noteContainer = document.getElementById('notesContainer')
    noteContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    const newNoteClass = document.getElementById('newNote');
    newNoteClass.style.display='none';
    const fragment = document.createDocumentFragment();
    let Notes = JSON.parse(storedNotes);
    if (storedNotes) {
        for (const key in Notes) {
            if (Notes.hasOwnProperty(key)) {
                const note = Notes[key];
                const template1 = listOfNotes(note);
                fragment.prepend(template1);


            }
        }
    } noteContainer.append(fragment);

}

function loadSearch(word) {
    const noteContainer = document.getElementById('notesContainer')
    noteContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const searchIndex = createIndexSearch(); 
    const searchResult = searchIndex[word] || []; 
    if (searchResult.length === 0) {
        loadNotes();

    } else {
        for (const key in searchResult) {
            const note = Notes[searchResult[key]];
            const template1 = listOfNotes(note);
            const backButton = template1.querySelector("#backButton");
            backButton.classList.remove('hide')
            backButton.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                loadNotes();
            });

            noteContainer.prepend(template1);

        }
    }
}
//Navigation to single note
function navigateToItem(noteId) {
    const noteContainer = document.getElementById('notesContainer');
    noteContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const note = Notes[noteIndex];
    const template1 = listOfNotes(note);
    noteContainer.prepend(template1);
    singleNote(noteId);

}