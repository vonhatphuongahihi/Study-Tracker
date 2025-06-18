'use client';
import VocabularyList from '../../components/VocabularyList';

export default function Vocabulary() {
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
                <h1>Vocabulary List</h1>
                <VocabularyList />
            </main>
        </div>
    );
} 