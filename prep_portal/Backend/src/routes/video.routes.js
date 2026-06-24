const express = require("express");
const router = express.Router();

const ctrl = require("../controller/video.controller");

// ===================== SUBJECT ROUTES =====================

// Get all subjects
router.get("/subjects", ctrl.getSubjects);

// Get topics by subject
router.get("/topics/:subject", ctrl.getTopics);

// ===================== VIDEO ROUTES =====================

// Get videos by subject + topic
router.get("/videos/:subject/:topic", ctrl.getVideos);

// Add new video
router.post("/videos", ctrl.addVideo);

// Search videos
router.get("/search", ctrl.searchVideos);

// Update LeetCode URL for a video
router.patch("/videos/:id/leetcode", ctrl.updateLeetcodeUrl);

module.exports = router;