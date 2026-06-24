const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Videos",
    required: true
  },
  note: {
    type: String,
    default: ""
  }
}, { timestamps: true })

// one note per user per video
noteSchema.index({ userId: 1, videoId: 1 }, { unique: true })

const noteModel = mongoose.model("Note", noteSchema)

module.exports = noteModel