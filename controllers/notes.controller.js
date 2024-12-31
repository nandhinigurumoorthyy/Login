const NoteModel = require("../model/notes.model");

async function fetchAllNotes() {
  return NoteModel.find();
}

async function fetchNoteId(noteId) {
  return NoteModel.findOne({ _id: noteId });
}

module.exports = { fetchAllNotes, fetchNoteId };
