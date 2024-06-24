import React, { useContext, useState, useEffect } from 'react';
import DataContext from '../context/dataContext';
import InfoPanel from './InfoPanel';
import './styles.css';

const Start = () => {
    const [level, setLevel] = useState('n5');
    const [lesson, setLesson] = useState('');
    const [question_type, setQuestionType] = useState('kanji-hiragana');
    const [infoPanelVisible, setInfoPanelVisible] = useState(false);
    const [lessonOptions, setLessonOptions] = useState([]);
    const [lessonsAvailable, setLessonsAvailable] = useState(false);

    const { startQuiz, showStart, chooseQuestions } = useContext(DataContext);

    useEffect(() => {
        const fetchLessonOptions = async () => {
            const lessons = [];
            for (let i = 1; i <= 72; i++) {
                try {
                    await import(`../../public/${level}/${question_type}/quiz${i}.json`);
                    lessons.push(
                        <option key={i} value={i}>
                            Lesson {i}
                        </option>
                    );
                } catch (error) {
                    // Файл не существует или произошла ошибка при загрузке
                }
            }
            if (lessons.length === 0) {
                lessons.push(
                    <option key="no-lesson" value="">
                        No lessons available
                    </option>
                );
                setLessonsAvailable(false);
            } else {
                setLessonsAvailable(true);
            }
            setLessonOptions(lessons);
        };

        if (level && question_type) {
            fetchLessonOptions();
        }
    }, [level, question_type]);

    const handleStartQuiz = () => {
        chooseQuestions(level, lesson, question_type);
        startQuiz();
    };

    return (
        <section className='text-white text-center bg-dark' style={{ display: `${showStart ? 'block' : 'none'}` }}>
            <div className="container">
                <div className="row vh-100 align-items-center justify-content-center">
                    <div className="col-lg-8">
                        <h1 className='fw-bold mb-4'>Japanese Quiz created by FiLL</h1>

                        <button onClick={handleStartQuiz} className="custom-select" disabled={!lessonsAvailable || !lesson} style={{ backgroundColor: (!lessonsAvailable || !lesson) ? 'gray' : '' }}>Start Quiz</button>

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
                            {lessonOptions}
                        </select>

                        <div>
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
