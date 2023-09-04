export { getNotes,getHistory, saveEditedNoteM, saveNoteM, editNoteM, searchNotes, deleteNoteM, saveHistory, restoreNotesFromHistoryM, createIndexSearch, editNoteM,putNoteInPlaceM };

//Get Notes
function getNotes(){
    let Notes;
    const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            Notes = JSON.parse(storedNotes);
        } else {
            Notes = [];
            localStorage.setItem('notes', JSON.stringify(Notes));
        }
    return Notes
}

function getHistory(){
    let changesHistory;
    const storedHistory = localStorage.getItem('history');
    if (storedHistory) {
        changesHistory = JSON.parse(storedHistory);
    } else {
        changesHistory = [];
        localStorage.setItem('history', JSON.stringify(changesHistory));
    }
    return changesHistory
}

//Save History
function saveHistory(array) {
    const storedHistory = localStorage.getItem('history');
    let changesHistory = JSON.parse(storedHistory);
    changesHistory.push(array);
    localStorage.setItem('history', JSON.stringify(changesHistory));

}

//Restore Notes
function restoreNotesFromHistoryM() {
    const storedHistory = localStorage.getItem('history');
    let changesHistory = JSON.parse(storedHistory);
    if (changesHistory.length > 0) {
        let Notes = changesHistory[changesHistory.length - 1];
        changesHistory.pop();
        localStorage.setItem('notes', JSON.stringify(Notes));
        localStorage.setItem('history', JSON.stringify(changesHistory));
    }
}

//SaveNote
function saveNoteM(title,text) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const currentDate = new Date();
    const newNote = {
        number: Notes.length,
        created: currentDate,
        lastModified: currentDate,
        title: title,
        text: text
    };
    const notesCopy = JSON.parse(JSON.stringify(Notes));
    saveHistory(notesCopy);
    Notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(Notes));
    }

//Delete Note
function deleteNoteM(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const index = Notes.findIndex(note => note.number === parseInt(noteId));
    if (index !== -1) {
        saveHistory(Notes);
        Notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(Notes));

    }
}

//Edit Note
function editNoteM(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const note = Notes[noteIndex];
    return note;
}

//Save Edited Note
function saveEditedNoteM(noteId,title,text) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    if (noteIndex !== -1) {
        saveHistory(Notes);
        Notes[noteIndex].title = title;
        Notes[noteIndex].text = text;
        Notes[noteIndex].lastModified = new Date();
        localStorage.setItem('notes', JSON.stringify(Notes));
    }
}

//Search
function createIndexSearch() {
    const storedNotes = localStorage.getItem('notes');
    const Notes = JSON.parse(storedNotes);
    const indexSearch = {};

    for (let i = 0; i < Notes.length; i++) {
        for (let item of Notes[i].text.match(/\b\w+\b/g)) {
            if (!indexSearch[item]) {
                indexSearch[item] = [];
            }
            if (!indexSearch[item].includes(i)) {
                indexSearch[item].push(i);
            }
        }
    }

    return indexSearch;
}

function searchNotes(word) {
    const indexSearchL = createIndexSearch()
    if (word in indexSearchL) {
        return indexSearchL[word];
    } else {
        return [];
    }

}




function reorderNotes(notes, originalIndex, newIndex) {
    const noteToMove = notes.splice(originalIndex, 1)[0];
    notes.splice(newIndex, 0, noteToMove);
}




//Drag and drop sort
function putNoteInPlaceM(noteId,newIndex){
    const divs = [];
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);

    for (const key in Notes) {
        if (Notes.hasOwnProperty(key)) {
            const note = Notes[key];
            divs.push(note.number);
        }
    }
    const foundIndex = divs.indexOf(newIndex);
    const originalIndex = divs.indexOf(noteId);
    
    if (originalIndex > -1 && foundIndex > -1 && originalIndex !== foundIndex) {
        const notesCopy = JSON.parse(JSON.stringify(Notes));
        saveHistory(notesCopy);
        reorderNotes(Notes, originalIndex, foundIndex);
        localStorage.setItem('notes', JSON.stringify(Notes));
    }


}