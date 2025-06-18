const DayTracker = require('../models/DayTracker');

// Get current day
const getCurrentDay = async (req, res) => {
    try {
        const tracker = await DayTracker.findOne();
        res.json(tracker || { date: new Date() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment day
const incrementDay = async (req, res) => {
    try {
        let tracker = await DayTracker.findOne();
        if (!tracker) {
            tracker = new DayTracker();
        }
        tracker.date = new Date();
        await tracker.save();
        res.json(tracker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCurrentDay,
    incrementDay
}; 