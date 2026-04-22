const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, "Subject required"]
    },

    topic:{
        type: String,
        required: [true, "topic is required"]
    },

    title:{
        type: String,
        required: [true, "title is required"]
    }, 
    videoUrl:{
        type:String,
        required: [true, "videoUrl not available"]
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
})

const videoModel = mongoose.model("Videos", videoSchema)

module.exports = videoModel