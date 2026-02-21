
const express = require('express');
const router = express.Router();

const ctrl = require("../controller/video.controller");

// subjects
router.get("/subjects", ctrl.getSubjects);

// topics by subject
router.get("/topics/:subject", ctrl.getTopics);

// videos by subject + topic
router.get("/videos/:subject/:topic", ctrl.getVideos);

// add video
router.post("/videos", ctrl.addVideo);

//searchvideos
router.get("/search", ctrl.searchVideos);




module.exports = router;
