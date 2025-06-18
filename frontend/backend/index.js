const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');
const dayTrackerRoutes = require('./routes/dayTrackerRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://vonhatphuongahihi:13032004@cluster0.ladnmeu.mongodb.net')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/days', dayTrackerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 