const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    videoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos",
        required: true
    },

    watched:{
        type: Boolean,
        default: true
    },

    subject: {
        type: String,
        required: true
    }
}, {timestamps: true})

const progressModel = mongoose.model("Progress", progressSchema)

module.exports = progressModel;