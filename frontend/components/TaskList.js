import { useState, useEffect } from 'react';

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [currentDay, setCurrentDay] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCurrentDay();
        fetchTasks();
        // Cập nhật ngày mỗi phút
        const interval = setInterval(fetchCurrentDay, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchCurrentDay = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/days/current');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCurrentDay(data.currentDay);
        } catch (error) {
            console.error('Error fetching current day:', error);
            setError('Không thể lấy thông tin ngày hiện tại');
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched tasks:', data);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Không thể lấy danh sách task');
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        setError('');
        const taskData = {
            title: newTask,
            dayNumber: currentDay
        };
        console.log('Sending task data:', taskData);

        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('Created task:', data);
            setTasks([data, ...tasks]);
            setNewTask('');
        } catch (error) {
            console.error('Error creating task:', error);
            setError('Không thể tạo task mới: ' + error.message);
        }
    };

    const completeTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}/complete`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Completed task:', data);
            setTasks(tasks.map(task =>
                task._id === id ? data : task
            ));
        } catch (error) {
            console.error('Error completing task:', error);
            setError('Không thể hoàn thành task');
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('Deleted task:', id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Không thể xóa task');
        }
    };

    // Format duration to minutes and seconds
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} phút ${remainingSeconds} giây`;
    };

    // Lọc tasks theo ngày hiện tại
    const currentDayTasks = tasks.filter(task => task.dayNumber === currentDay);

    return (
        <div className="task-list">
            <div className="day-tracker">
                <h2>Day {currentDay}</h2>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={createTask} className="task-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter a new task..."
                    required
                />
                <button type="submit">Add Task</button>
            </form>

            <div className="tasks">
                {currentDayTasks && currentDayTasks.map((task) => (
                    <div key={task._id || Math.random()} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <h3>{task.title}</h3>
                        <div className="task-info">
                            <p>Started: {new Date(task.startTime).toLocaleString()}</p>
                            {task.completed && (
                                <>
                                    <p>Completed: {new Date(task.endTime).toLocaleString()}</p>
                                    <p>Duration: {formatDuration(task.duration)}</p>
                                </>
                            )}
                            <p>Day: {task.dayNumber}</p>
                        </div>
                        <div className="task-actions">
                            {!task.completed && (
                                <button onClick={() => completeTask(task._id)}>Complete</button>
                            )}
                            <button onClick={() => deleteTask(task._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 