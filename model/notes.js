const mongoose = require("mongoose")

const NoteSchema = new mongoose.Schema({
    NoteId: { type: String, required: true, unique: false },
    NoteText: { type: String, required: true, unique: false }
}, { collection: "notes" })

const notes = mongoose.model("NoteSchema", NoteSchema)

module.exports = notes