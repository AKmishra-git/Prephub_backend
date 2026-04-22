
const videoModel = require("../models/video.models");

// ===================== SEARCH VIDEOS =====================
exports.searchVideos = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Query 'q' is required"
      });
    }

    // title पर case-insensitive search
    const videos = await videoModel.find({
      title: { $regex: q, $options: "i" }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


// ===================== GET ALL SUBJECTS =====================
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await videoModel.distinct("subject");

    res.json({
      success: true,
      data: subjects
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== GET TOPICS BY SUBJECT =====================
exports.getTopics = async (req, res) => {
  try {
    const subject = req.params.subject.trim().toLowerCase();

    const topics = await videoModel
      .find({ subject: subject })
      .distinct("topic");

    res.json({
      success: true,
      data: topics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== GET VIDEOS BY SUBJECT + TOPIC =====================
exports.getVideos = async (req, res) => {
  console.log("🔥 GET VIDEOS HIT", req.method, req.originalUrl)
  try {
    const subject = req.params.subject.trim().toLowerCase();
    const topic = req.params.topic.trim().toLowerCase();

    const videos = await videoModel.find({
      subject: subject,
      topic: topic
    });

    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== ADD NEW VIDEO =====================
exports.addVideo = async (req, res) => {
  try {
    let { subject, topic, title, videoUrl } = req.body;

    // 🔹 1. Check all fields
    if (!subject || !topic || !title || !videoUrl) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // 🔹 2. Clean data
    subject = subject.trim().toLowerCase();
    topic = topic.trim().toLowerCase();
    title = title.trim();

    // 🔹 3. Validate YouTube URL
    if (
      !videoUrl.includes("youtube.com") &&
      !videoUrl.includes("youtu.be")
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid YouTube URL"
      });
    }

    // 🔹 4. Check duplicate
    const existing = await videoModel.findOne({
      subject,
      topic,
      title
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Video already exists"
      });
    }

    // 🔹 5. Save in DB
    const video = await videoModel.create({
      subject,
      topic,
      title,
      videoUrl
    });

    // 🔹 6. Response
    res.json({
      success: true,
      data: video
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
