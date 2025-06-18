const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    meaning: {
        type: String,
        required: true
    },
    lesson: {
        type: Number,
        required: true
    },
    notes: String,
    learnedDate: {
        type: Date,
        default: Date.now
    }
});

// Separate schema for completed lessons
const completedLessonsSchema = new mongoose.Schema({
    lessons: {
        type: [Number],
        default: []
    }
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
const CompletedLessons = mongoose.model('CompletedLessons', completedLessonsSchema);

module.exports = {
    Vocabulary,
    CompletedLessons
}; 