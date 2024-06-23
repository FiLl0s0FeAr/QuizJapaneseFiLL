import React, { useContext } from 'react';
import DataContext from '../context/dataContext';

const InfoPanel = () => {
    const { lastLesson, readyTests } = useContext(DataContext);

    const getTestsToDo = () => {
        if (!lastLesson.level || !lastLesson.question_type) {
            return [];
        }

        const maxLessons = 72;
        const completedLessons = readyTests[lastLesson.level]?.[lastLesson.question_type] || 0;
        const testsToDo = [];

        for (let i = completedLessons + 1; i <= maxLessons; i++) {
            testsToDo.push(i);
        }

        return testsToDo;
    };

    return (
        <div className="info-panel">
            <h4>Last Conducted Lesson</h4>
            <p>Level: {lastLesson.level}</p>
            <p>Lesson: {lastLesson.lesson}</p>
            <p>Question Type: {lastLesson.question_type}</p>

            <h4>Last Ready Test</h4>
            <p>Level: {lastLesson.level}</p>
            <p>Lesson: {lastLesson.level && lastLesson.question_type ? readyTests[lastLesson.level]?.[lastLesson.question_type] : 'N/A'}</p>

            <h4>Tests to Do</h4>
            <ul>
                {getTestsToDo().map((test, index) => (
                    <li key={index}>Lesson {test}</li>
                ))}
            </ul>
        </div>
    );
};

export default InfoPanel;
