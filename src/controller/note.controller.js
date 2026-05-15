const Note = require("../models/note.model")

// GET /api/notes/:videoId
async function getNote(req, res) {
  try {
    const userId = req.user.userId
    const { videoId } = req.params

    const note = await Note.findOne({ userId, videoId })

    res.json({ success: true, note: note?.note || "" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// POST /api/notes/:videoId
async function saveNote(req, res) {
  try {
    const userId = req.user.userId
    const { videoId } = req.params
    const { note } = req.body

    await Note.findOneAndUpdate(
      { userId, videoId },
      { note },
      { upsert: true, new: true }
    )

    res.json({ success: true, message: "Note saved" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = { getNote, saveNote }