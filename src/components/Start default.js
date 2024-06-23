import React, { useContext, useState, useEffect } from 'react';
import DataContext from '../context/dataContext';
import InfoPanel from './InfoPanel';
import './styles.css'; 

const Start = () => {
    const [level, setLevel] = useState('n5');
    const [lesson, setLesson] = useState('1');
    const [question_type, setQuestionType] = useState('kanji-hiragana');
    const [infoPanelVisible, setInfoPanelVisible] = useState(false);

    const { startQuiz, showStart, chooseQuestions } = useContext(DataContext);

    const handleStartQuiz = () => {
        chooseQuestions(level, lesson, question_type);
        startQuiz();
    };

    const generateLessonOptions = () => {
        const options = [];
        for (let i = 1; i <= 72; i++) {
            options.push(
                <option key={i} value={i}>Lesson {i}</option>
            );
        }
        return options;
    };

    useEffect(() => {
        chooseQuestions(level, lesson, question_type);
    }, [level, lesson, question_type]);

    return (
        <section className='text-white text-center bg-dark' style={{ display: `${showStart ? 'block' : 'none'}` }}>
            <div className="container">
                <div className="row vh-100 align-items-center justify-content-center">
                    <div className="col-lg-8">
                        <h1 className='fw-bold mb-4'>Basic React JS Quiz</h1>

                        <button onClick={handleStartQuiz} className="custom-select">Start Quiz</button>

                        <select onChange={(e) => setLevel(e.target.value)} value={level} className="custom-select">
                            <option value="n5">N5</option>
                            <option value="n5-n4">N5-N4</option>
                            <option value="n4">N4</option>
                            <option value="n3">N3</option>
                            <option value="n2">N2</option>
                            <option value="n1">N1</option>
                        </select>

                        <select onChange={(e) => setQuestionType(e.target.value)} value={question_type} className="custom-select">
                            <option value="kanji-hiragana">漢字 - ひらがな</option>
                            <option value="kanji-word">漢字 - 言葉</option>
                            <option value="hiragana-word">ひらがな - 言葉</option>
                            <option value="hiragana-kanji">ひらがな - 漢字</option>
                            <option value="word-kanji">言葉 - 漢字</option>
                            <option value="word-hiragana">言葉 - ひらがな</option>
                        </select>

                        <select onChange={(e) => setLesson(e.target.value)} value={lesson} className="custom-select">
                            {generateLessonOptions()}
                        </select>

                        <div className="mt-4">
                            <button onClick={() => setInfoPanelVisible(!infoPanelVisible)} className="btn btn-info mt-3">Toggle Info Panel</button>
                        </div>

                        <div className={`info-panel ${infoPanelVisible ? 'visible' : ''}`}>
                            <InfoPanel />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Start;
