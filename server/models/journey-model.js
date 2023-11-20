const mongoose = require("mongoose");
const journeySchema = new mongoose.Schema({
    journeyTitle: {
        type: String,
        required: true,
        maxLength: 18
    },
    journeyContent: {
        type: String,
        required: true,
        maxLength: 100
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Journey = mongoose.model("Journey", journeySchema);
module.exports = Journey;