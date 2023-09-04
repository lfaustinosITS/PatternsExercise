import { displayNotes,displayResults,readFields,editNoteTemplate,startEvents,readNewFields,singleNote } from "./03-view.js";
import { getNotes, saveEditedNoteM, deleteNoteM, editNoteM, getHistory,saveNoteM, searchNotes, putNoteInPlaceM,restoreNotesFromHistoryM } from "./01-model.js";
export { loadNotes, loadSearch, navigateToItem,saveEditedNote,deleteNote,editNote,saveNote,putNoteInPlace,restoreNotesFromHistory };

//Save notes
function saveNote(){
    let note = readNewFields();
    saveNoteM(note.title,note.text)
}

function saveEditedNote(noteId){
    const editedNote=readFields();
    saveEditedNoteM(noteId,editedNote.title,editedNote.text)
}
//Delete notes
function deleteNote(noteId){
    deleteNoteM(noteId)
}
//Edit note
function editNote(noteId){
    const note = editNoteM(noteId);
    editNoteTemplate(note);
}

//JSON load notes
function loadNotes() {
    let Notes = getNotes();
    if(!Notes){
        Notes = [];
    } 
    displayNotes(Notes);
    

}

function putNoteInPlace(noteId,newIndex){
    putNoteInPlaceM(noteId,newIndex);
    loadNotes();
}


function loadSearch(word) {
    let Notes = getNotes();
    const searchIndex = searchNotes(word) || [];
    if (searchIndex.length === 0) {
       
        loadNotes();

    } else {
        displayResults(searchIndex,Notes)
        
    }
}
//Navigation to single note
function navigateToItem(noteId) {
    let Notes = getNotes();
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const note = Notes[noteIndex];
    const singleNoteObject = {note}
    displayNotes(singleNoteObject);
    singleNote(noteId);

}


function restoreNotesFromHistory(){
    restoreNotesFromHistoryM();
    loadNotes();
}


//Initialize App
function initializeApp() {
    let Notes = getNotes(); 
    let History = getHistory();
    loadNotes();
    startEvents();
}

initializeApp()

