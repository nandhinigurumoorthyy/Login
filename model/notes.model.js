const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
  {
    notename: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },

  { timetamps: true }
);

const NoteModel = mongoose.model("notes", NoteSchema);
module.exports = NoteModel;
