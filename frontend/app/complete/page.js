'use client';
import { useState, useEffect } from 'react';

export default function CompletedTasks() {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    const fetchCompletedTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            const data = await response.json();
            const completed = data.filter(task => task.completed);
            setCompletedTasks(completed);
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    // Format duration to minutes and seconds
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} phút ${remainingSeconds} giây`;
    };

    return (
        <div className="container">
            <nav className="navbar">
                <div className="nav-content">
                    <h1>Study Tracker</h1>
                    <div className="nav-links">
                        <a href="/">Tasks</a>
                        <a href="/vocabulary">Vocabulary</a>
                        <a href="/complete">Completed</a>
                    </div>
                </div>
            </nav>
            <main>
                <h1>Completed Tasks</h1>
                <div className="tasks">
                    {completedTasks.map((task) => (
                        <div key={task._id} className="task-item completed">
                            <h3>{task.title}</h3>
                            <div className="task-info">
                                <p>Started: {new Date(task.startTime).toLocaleString()}</p>
                                <p>Completed: {new Date(task.endTime).toLocaleString()}</p>
                                <p>Duration: {formatDuration(task.duration)}</p>
                                <p>Day: {task.dayNumber}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
} 