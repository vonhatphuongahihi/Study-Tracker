const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        default: 0  // Duration in seconds
    },
    dayNumber: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema); 