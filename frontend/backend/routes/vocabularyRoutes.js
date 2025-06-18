const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');

// Basic vocabulary routes
router.get('/', vocabularyController.getAllVocabulary);
router.post('/', vocabularyController.createVocabulary);
router.delete('/:id', vocabularyController.deleteVocabulary);

// Completed lessons routes
router.get('/completed-lessons', vocabularyController.getCompletedLessons);
router.put('/completed-lessons', vocabularyController.updateCompletedLessons);

module.exports = router; 