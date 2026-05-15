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

async function getDashboardStats(req, res) {
  try {
    const userId = req.user.userId

    const subjects = ["dsa", "oops", "cn", "os", "dbms"]

    const stats = await Promise.all(subjects.map(async (subject) => {
      const totalVideos = await Video.countDocuments({ subject })
      const watchedVideos = await Progress.countDocuments({ userId, subject })
      const percent = totalVideos === 0 ? 0 : Math.round((watchedVideos / totalVideos) * 100)
      return { subject: subject.toUpperCase(), totalVideos, watchedVideos, percent }
    }))

    const totalWatched = await Progress.countDocuments({ userId })
    const totalVideos = await Video.countDocuments()

    // streak — count distinct days user marked videos watched
    const progressDocs = await Progress.find({ userId }).sort({ createdAt: -1 })
    const uniqueDays = [...new Set(progressDocs.map(p => p.createdAt.toISOString().split("T")[0]))]
    
    let streak = 0
    const today = new Date().toISOString().split("T")[0]
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split("T")[0]
      if (uniqueDays[i] === expected) streak++
      else break
    }

    res.json({
      success: true,
      stats,
      totalWatched,
      totalVideos,
      streak
    })

  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = { markWatched, getProgress, getDashboardStats }


