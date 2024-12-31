const NoteModel = require("../model/notes.model");

async function fetchAllNotes() {
  return NoteModel.find();
}

module.exports = { fetchAllNotes };
