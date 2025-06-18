const Task = require('../models/Task');

// Lấy tất cả tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error in getAllTasks:', error);
        res.status(500).json({ message: error.message });
    }
};

// Tạo task mới
exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            startTime: new Date(),
            dayNumber: req.body.dayNumber
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error in createTask:', error);
        res.status(400).json({ message: error.message });
    }
};

// Hoàn thành task
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task không tồn tại' });
        }

        task.completed = true;
        task.endTime = new Date();
        task.duration = Math.floor((task.endTime - task.startTime) / 1000);

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        console.error('Error in completeTask:', error);
        res.status(400).json({ message: error.message });
    }
};

// Xóa task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task không tồn tại' });
        }
        await Task.deleteOne({ _id: task._id });
        res.json({ message: 'Task đã được xóa' });
    } catch (error) {
        console.error('Error in deleteTask:', error);
        res.status(500).json({ message: error.message });
    }
}; 