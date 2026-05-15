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
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ===================== GET TOPICS BY SUBJECT =====================
exports.getTopics = async (req, res) => {
  try {
    const subject = req.params.subject.trim().toLowerCase();

    const topics = await videoModel
      .find({ subject })
      .distinct("topic");

    res.json({
      success: true,
      data: topics
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ===================== GET VIDEOS BY SUBJECT + TOPIC =====================
exports.getVideos = async (req, res) => {
  try {
    const subject = req.params.subject.trim().toLowerCase();
    const topic = req.params.topic.trim().toLowerCase();

    const videos = await videoModel.find({
      subject,
      topic
    });

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

// ===================== ADD NEW VIDEO =====================
exports.addVideo = async (req, res) => {
  try {
    let {
      subject,
      topic,
      title,
      videoUrl,
      leetcodeUrl
    } = req.body;

    // Validate fields
    if (!subject || !topic || !title || !videoUrl) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be provided"
      });
    }

    // Clean data
    subject = subject.trim().toLowerCase();
    topic = topic.trim().toLowerCase();
    title = title.trim();

    // Validate YouTube URL
    if (
      !videoUrl.includes("youtube.com") &&
      !videoUrl.includes("youtu.be")
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid YouTube URL"
      });
    }

    // Duplicate check
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

    // Create video
    const video = await videoModel.create({
      subject,
      topic,
      title,
      videoUrl,
      leetcodeUrl: leetcodeUrl || ""
    });

    res.status(201).json({
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

// ===================== UPDATE LEETCODE URL =====================
exports.updateLeetcodeUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { leetcodeUrl } = req.body;

    if (!leetcodeUrl) {
      return res.status(400).json({
        success: false,
        error: "leetcodeUrl is required"
      });
    }

    const video = await videoModel.findByIdAndUpdate(
      id,
      { leetcodeUrl },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Video not found"
      });
    }

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