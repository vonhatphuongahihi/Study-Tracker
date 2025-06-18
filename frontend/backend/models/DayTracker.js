const mongoose = require('mongoose');

const dayTrackerSchema = new mongoose.Schema({
    currentDay: {
        type: Number,
        required: true,
        default: 1
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DayTracker', dayTrackerSchema); 