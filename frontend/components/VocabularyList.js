import { useState, useEffect } from 'react';

export default function VocabularyList() {
    const [vocabulary, setVocabulary] = useState([]);
    const [newWord, setNewWord] = useState({
        word: '',
        meaning: '',
        lesson: '',
        notes: ''
    });
    const [completedLessons, setCompletedLessons] = useState([]);
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVocabulary();
        fetchCompletedLessons();
    }, []);

    const fetchCompletedLessons = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vocabulary/completed-lessons');
            const data = await response.json();
            setCompletedLessons(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching completed lessons:', error);
            setError('Unable to fetch completed lessons');
            setCompletedLessons([]);
        }
    };

    const fetchVocabulary = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vocabulary');
            const data = await response.json();
            setVocabulary(data);
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
            setError('Unable to fetch vocabulary list');
        }
    };

    const createVocabulary = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/vocabulary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newWord,
                    lesson: parseInt(newWord.lesson)
                }),
            });
            const data = await response.json();
            setVocabulary([data, ...vocabulary]);
            setNewWord({ word: '', meaning: '', lesson: '', notes: '' });
        } catch (error) {
            console.error('Error creating vocabulary:', error);
            setError('Unable to add new vocabulary');
        }
    };

    const deleteVocabulary = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/vocabulary/${id}`, {
                method: 'DELETE',
            });
            setVocabulary(vocabulary.filter(word => word._id !== id));
        } catch (error) {
            console.error('Error deleting vocabulary:', error);
            setError('Unable to delete vocabulary');
        }
    };

    const completeLesson = async (lessonNumber) => {
        if (!completedLessons.includes(lessonNumber)) {
            const newCompletedLessons = [...completedLessons, lessonNumber];
            try {
                const response = await fetch('http://localhost:5000/api/vocabulary/completed-lessons', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ completedLessons: newCompletedLessons }),
                });
                const data = await response.json();
                setCompletedLessons(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error updating completed lessons:', error);
                setError('Unable to update completed lessons');
            }
        }
    };

    const toggleLesson = (lessonNumber) => {
        if (expandedLesson === lessonNumber) {
            setExpandedLesson(null);
        } else {
            setExpandedLesson(lessonNumber);
        }
    };

    // Nhóm từ vựng theo lesson
    const groupedVocabulary = vocabulary.reduce((groups, word) => {
        const lesson = word.lesson;
        if (!groups[lesson]) {
            groups[lesson] = [];
        }
        groups[lesson].push(word);
        return groups;
    }, {});

    // Sắp xếp lessons theo thứ tự tăng dần
    const sortedLessons = Object.keys(groupedVocabulary)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div className="vocabulary-list">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={createVocabulary} className="vocabulary-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={newWord.word}
                        onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                        placeholder="Enter word..."
                        required
                    />
                    <input
                        type="text"
                        value={newWord.meaning}
                        onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                        placeholder="Enter meaning..."
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        value={newWord.lesson}
                        onChange={(e) => setNewWord({ ...newWord, lesson: e.target.value })}
                        placeholder="Enter lesson number..."
                        required
                    />
                    <input
                        type="text"
                        value={newWord.notes}
                        onChange={(e) => setNewWord({ ...newWord, notes: e.target.value })}
                        placeholder="Enter notes (optional)..."
                    />
                </div>
                <button type="submit">Add Word</button>
            </form>

            <div className="active-lessons">
                <h2>Active Lessons</h2>
                {sortedLessons
                    .filter(lesson => !completedLessons.includes(lesson))
                    .map(lesson => (
                        <div key={lesson} className="lesson-card">
                            <div className="lesson-header">
                                <h3>Lesson {lesson}</h3>
                                <div className="lesson-actions">
                                    <button onClick={() => completeLesson(lesson)}>Complete Lesson</button>
                                </div>
                            </div>
                            <div className="vocabulary-items">
                                {groupedVocabulary[lesson].map((word) => (
                                    <div key={word._id} className="vocabulary-item">
                                        <div className="word-header">
                                            <h3>{word.word}</h3>
                                            <button onClick={() => deleteVocabulary(word._id)}>Delete</button>
                                        </div>
                                        <p><strong>Meaning:</strong> {word.meaning}</p>
                                        {word.notes && <p><strong>Notes:</strong> {word.notes}</p>}
                                        <p><strong>Learned:</strong> {new Date(word.learnedDate).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>

            <div className="completed-lessons">
                <h2>Completed Lessons</h2>
                {sortedLessons
                    .filter(lesson => completedLessons.includes(lesson))
                    .map(lesson => (
                        <div key={lesson} className={`lesson-card completed ${expandedLesson === lesson ? 'expanded' : ''}`}>
                            <div className="lesson-header" onClick={() => toggleLesson(lesson)}>
                                <h3>Lesson {lesson}</h3>
                                <div className="expand-icon">{expandedLesson === lesson ? '▼' : '▶'}</div>
                            </div>
                            {expandedLesson === lesson && (
                                <div className="vocabulary-items">
                                    {groupedVocabulary[lesson].map((word) => (
                                        <div key={word._id} className="vocabulary-item">
                                            <div className="word-header">
                                                <h3>{word.word}</h3>
                                            </div>
                                            <p><strong>Meaning:</strong> {word.meaning}</p>
                                            {word.notes && <p><strong>Notes:</strong> {word.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
} 