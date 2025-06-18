const { Vocabulary, CompletedLessons } = require('../models/Vocabulary');

// Get all vocabulary
exports.getAllVocabulary = async (req, res) => {
    try {
        const vocabulary = await Vocabulary.find().sort({ learnedDate: -1 });
        res.json(vocabulary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new vocabulary
exports.createVocabulary = async (req, res) => {
    const vocabulary = new Vocabulary({
        word: req.body.word,
        meaning: req.body.meaning,
        lesson: req.body.lesson,
        notes: req.body.notes
    });

    try {
        const newVocabulary = await vocabulary.save();
        res.status(201).json(newVocabulary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete vocabulary
exports.deleteVocabulary = async (req, res) => {
    try {
        await Vocabulary.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vocabulary deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get completed lessons
exports.getCompletedLessons = async (req, res) => {
    try {
        let completedLessons = await CompletedLessons.findOne();
        if (!completedLessons) {
            completedLessons = await CompletedLessons.create({ lessons: [] });
        }
        res.json(completedLessons.lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update completed lessons
exports.updateCompletedLessons = async (req, res) => {
    try {
        let completedLessons = await CompletedLessons.findOne();
        if (!completedLessons) {
            completedLessons = new CompletedLessons({ lessons: req.body.completedLessons });
        } else {
            completedLessons.lessons = req.body.completedLessons;
        }
        await completedLessons.save();
        res.json(completedLessons.lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

