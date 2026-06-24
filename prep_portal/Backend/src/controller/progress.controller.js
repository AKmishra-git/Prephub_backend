const Progress = require("../models/progress.model")
const Video = require("../models/video.models")

async function markWatched(req, res) {
  try {
    const userId = req.user.userId
    const { videoId, subject } = req.body

    const already = await Progress.findOne({ userId, videoId, subject })

    if (already) {
      return res.json({ success: true, message: "Already watched" })
    }

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

    const watchedVideos = await Progress.countDocuments({ userId, subject })

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

    // streak calculation
    const progressDocs = await Progress.find({ userId }).sort({ createdAt: -1 })
    const uniqueDays = [...new Set(progressDocs.map(p => p.createdAt.toISOString().split("T")[0]))]

    let streak = 0
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split("T")[0]
      if (uniqueDays[i] === expected) streak++
      else break
    }

    // activity heatmap — last 365 days
    const oneYearAgo = new Date(Date.now() - 365 * 86400000)
    const recentDocs = await Progress.find({
      userId,
      createdAt: { $gte: oneYearAgo }
    })

    // count videos per day
    const activityMap= {}
    recentDocs.forEach(doc => {
      const day = doc.createdAt.toISOString().split("T")[0]
      activityMap[day] = (activityMap[day] || 0) + 1
    })

    // last 5 days watched count
    const last5Days = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(Date.now() - i * 86400000).toISOString().split("T")[0]
      return { date, count: activityMap[date] || 0 }
    }).reverse()

    // recently watched videos
    const recentWatched = await Progress.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("videoId", "title subject topic videoUrl")

    res.json({
      success: true,
      stats,
      totalWatched,
      totalVideos,
      streak,
      activityMap,
      last5Days,
      recentWatched
    })

  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = {
  markWatched,
  getProgress,
  getDashboardStats
}