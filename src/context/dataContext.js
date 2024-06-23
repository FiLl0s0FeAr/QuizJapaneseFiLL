import { createContext, useState, useEffect } from "react";
import { options1 } from './options1'; 
import { options2 } from './options2'; 
import { options3 } from './options3'; 

const DataContext = createContext({});

export const DataProvider = ({children}) => {
  const [quizs, setQuizs] = useState([]);
  const [question, setQuesion] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [marks, setMarks] = useState(0);
  const [questionsWithOptions, setQuestionsWithOptions] = useState({});
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(options1);
  const [currentLevel, setCurrentLevel] = useState('');
  const [currentLesson, setCurrentLesson] = useState('');
  const [currentQuestionType, setCurrentQuestionType] = useState('');
  const [lastLesson, setLastLesson] = useState({ level: '', lesson: '', question_type: '' });
  const [readyTests, setReadyTests] = useState({});

  const fetchQuestions = async (level, lesson, questionType) => {
    let file = `${process.env.PUBLIC_URL}/${level}/${questionType}/quiz${lesson}.json`;
    const response = await fetch(file);
    if (response.ok) {
      const data = await response.json();
      setQuizs(data);
      setQuestionIndex(0);
      setQuestionsWithOptions({});
    }
  };

  useEffect(() => {
    if (currentLevel && currentLesson && currentQuestionType) {
      fetchQuestions(currentLevel, currentLesson, currentQuestionType);
    }
  }, [currentLevel, currentLesson, currentQuestionType]);

  useEffect(() => {
    if (quizs.length > questionIndex) {
      const currentQuestion = quizs[questionIndex];

      if (!questionsWithOptions[currentQuestion.id]) {
        const randomOptions = generateRandomOptions(currentQuestion.answer);
        setQuestionsWithOptions(prevState => ({
          ...prevState,
          [currentQuestion.id]: { ...currentQuestion, options: randomOptions }
        }));
      }

      setQuesion(questionsWithOptions[currentQuestion.id] || currentQuestion);
      setCorrectAnswer(currentQuestion.answer);
    }
  }, [quizs, questionIndex, questionsWithOptions]);

  const generateRandomOptions = (correctAnswer) => {
    let options = currentOptions.filter(option => option !== correctAnswer);
    let randomOptions = [];
    while (randomOptions.length < 3) {
      const randomIndex = Math.floor(Math.random() * options.length);
      const option = options[randomIndex];
      if (!randomOptions.includes(option)) {
        randomOptions.push(option);
      }
    }
    randomOptions.push(correctAnswer);
    return shuffleArray(randomOptions);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startQuiz = () => {
    setShowStart(false);
    setShowQuiz(true);
    setLastLesson({ level: currentLevel, lesson: currentLesson, question_type: currentQuestionType });
    setReadyTests(prevState => ({
      ...prevState,
      [currentLevel]: {
        ...prevState[currentLevel],
        [currentQuestionType]: parseInt(currentLesson, 10)
      }
    }));
  };

  const chooseQuestions = (level, lesson, question_type) => {
    setCurrentLevel(level);
    setCurrentLesson(lesson);
    setCurrentQuestionType(question_type);

    switch(question_type) {
      case 'kanji-hiragana':
      case 'word-hiragana':
        setCurrentOptions(options1);
        break;
      case 'hiragana-kanji':
      case 'word-kanji':
        setCurrentOptions(options2);
        break;
      case 'hiragana-word':
      case 'kanji-word':
        setCurrentOptions(options3);
        break;
      default:
        setCurrentOptions(options1);
    }
  };

  const checkAnswer = (event, selected) => {
    if (!selectedAnswer) {
      setCorrectAnswer(question.answer);
      setSelectedAnswer(selected);

      if (selected === question.answer) {
        event.target.classList.add('bg-success');
        setMarks(prevMarks => prevMarks + 1);
      } else {
        event.target.classList.add('bg-danger');
      }
    }
  };

  const nextQuestion = () => {
    setCorrectAnswer('');
    setSelectedAnswer('');
    const wrongBtn = document.querySelector('button.bg-danger');
    wrongBtn?.classList.remove('bg-danger');
    const rightBtn = document.querySelector('button.bg-success');
    rightBtn?.classList.remove('bg-success');
    setQuestionIndex(prevIndex => prevIndex + 1);
  };

  const showTheResult = () => {
    setShowResult(true);
    setShowStart(false);
    setShowQuiz(false);
  };

  const startOver = () => {
    setShowStart(true);
    setShowResult(false);
    setShowQuiz(false);
    setCorrectAnswer('');
    setSelectedAnswer('');
    setQuestionIndex(0);
    setMarks(0);
    const wrongBtn = document.querySelector('button.bg-danger');
    wrongBtn?.classList.remove('bg-danger');
    const rightBtn = document.querySelector('button.bg-success');
    rightBtn?.classList.remove('bg-success');
  };

  return (
    <DataContext.Provider value={{
      startQuiz, showStart, showQuiz, question, quizs, checkAnswer, correctAnswer,
      selectedAnswer, questionIndex, nextQuestion, showTheResult, showResult, marks,
      startOver, chooseQuestions, setShowStart, setCurrentLevel, setCurrentLesson, setCurrentQuestionType,
      lastLesson, readyTests
    }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
