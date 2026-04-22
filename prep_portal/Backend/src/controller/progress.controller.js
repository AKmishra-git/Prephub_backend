const Progress = require("../models/progress.model")
const Video = require("../models/video.models")

async function markWatched(req, res) {
  try {
    const userId = req.user.userId
    const { videoId, subject } = req.body   // ✅ FIXED

    // check already marked
    const already = await Progress.findOne({ userId, videoId, subject })

    if (already) {
      return res.json({ success: true, message: "Already watched" })
    }

    // save with subject
    await Progress.create({ userId, videoId, subject })

    res.json({ success: true, message: "Marked as watched" })

  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
async function getProgress(req, res) {
  try {
    const userId = req.user.userId
    const subject = req.params.subject.toLowerCase()

    const totalVideos = await Video.countDocuments({ subject })

    // ✅ FIXED (filter by subject)
    const watchedVideos = await Progress.countDocuments({
      userId,
      subject
    })

    const percent =
      totalVideos === 0
        ? 0
        : Math.round((watchedVideos / totalVideos) * 100)

    res.json({
      success: true,
      totalVideos,
      watchedVideos,
      percent
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = {
    markWatched,
    getProgress

}
