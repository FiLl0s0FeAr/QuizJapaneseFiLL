import React, { useContext } from 'react';
import DataContext from '../context/dataContext';

const Result = () => {
    const { showResult, quizs, marks, startOver, setShowStart } = useContext(DataContext);

    const handleStartOver = () => {
        startOver();
        setShowStart(true);
    };

    return (
        <section className="bg-dark text-white" style={{ display: `${showResult ? 'block' : 'none'}` }}>
            <div className="container">
                <div className="row vh-100 align-items-center justify-content-center">
                    <div className="col-lg-6">
                        <div className={`text-light text-center p-5 rounded ${marks === quizs.length ? 'bg-success' : 'bg-danger'}`}>
                            <h1 className='mb-2 fw-bold'>{marks === quizs.length ? 'Awesome!' : 'Oops!'}</h1>
                            <h3 className='mb-3 fw-bold'>Your score is {marks} out of {quizs.length}</h3>

                            <button onClick={startOver} className='btn py-2 px-4 btn-light fw-bold d-inline'>Start Over</button>

                            <button onClick={handleStartOver} className='btn py-2 px-4 btn-light fw-bold d-inline'>Choose Lesson</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Result;
