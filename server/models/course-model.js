const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    id: {
        type: String
    },
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        required: true,
        maxLength: 100
    },
    chapters: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        require: true,
        min: 99,
        max: 5999
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    students: {
        type: [String],
        default: []
    },
    marked: {
        type: [String],
        default: []
    }
})

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;