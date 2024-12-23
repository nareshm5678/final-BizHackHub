import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import PuzzleGrid from './components/PuzzleGrid';
import Quiz from './components/Quiz';
import GameStatus from './components/GameStatus';
import StartScreen from './components/StartScreen';
import SummaryScreen from './components/SummaryScreen';
import Confetti from './components/Confetti';
import GameOver from './components/GameOver';
import { useTimer } from './hooks/useTimer';
import { saveGameTime } from './services/gameService';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const [hints, setHints] = useState([
    '/images/level-1.jpeg',
    '/images/level-2.jpeg',
    '/images/level-3.jpeg',
  ]); // Array of hint images for each level

  const timer = useTimer(gameStarted);

  useEffect(() => {
    if (showQuiz) {
      fetchQuiz();
    }
  }, [showQuiz, currentLevel]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/quiz/${currentLevel + 1}`);
      if (response.data.success) {
        setQuiz(response.data.question);
      } else {
        console.error('No quiz data received.');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handlePuzzleSolved = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setShowQuiz(true);
    }, 2000);
  };

  const handleStartGame = (name) => {
    console.log('Starting game with username:', name);
    setUsername(name);
    setGameStarted(true);
  };

  const handleQuizAnswer = async (answer) => {
    if (!quiz) return;
    
    if (answer === quiz.answer) {
      if (currentLevel < hints.length - 1) {
        setShowQuiz(false);
        setCurrentLevel(prev => prev + 1);
      } else {
        try {
          await saveGameTime(timer.time, username);
          setGameCompleted(true);
        } catch (error) {
          console.error('Error saving completion time:', error);
        }
      }
    } else {
      // Wrong answer selected - trigger game over
      try {
        console.log('Saving game over with username:', username);
        const response = await axios.post('http://localhost:5000/api/gameover', {
          timeTaken: timer.time,
          username: username
        });
        console.log('Game over save response:', response.data);
        
        if (response.data.success) {
          setShowQuiz(false);
          setGameStarted(true);
          setIsGameOver(true);
          setGameCompleted(false);
        } else {
          console.error('Failed to save game over:', response.data.error);
        }
      } catch (error) {
        console.error('Error saving game over time:', error);
      }
    }
  };

  const handleRestart = () => {
    setCurrentLevel(0);
    setQuiz(null);
    setShowQuiz(false);
    setGameStarted(false);
    setShowConfetti(false);
    setGameCompleted(false);
    setIsGameOver(false);
    setUsername('');
    timer.reset();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8 px-4"
      style={{ backgroundImage: 'url(/images/bg1.jpg)' }}
    >
      <div className="max-w-4xl mx-auto">
        {showConfetti && <Confetti />}
        {isGameOver && (
          <GameOver 
            timeTaken={timer.time}
            username={username}
            onRestart={handleRestart}
          />
        )}
        {!isGameOver && (
          !gameStarted ? (
            <StartScreen onStart={handleStartGame} />
          ) : gameCompleted ? (
            <SummaryScreen timeTaken={timer.time} onRestart={handleRestart} />
          ) : (
            <>
              <GameStatus level={currentLevel} timer={timer.time} />
              <AnimatePresence mode="wait">
                {showQuiz && quiz ? (
                  <Quiz key="quiz" quiz={quiz} onAnswer={handleQuizAnswer} />
                ) : (
                  <PuzzleGrid
                    key="puzzle"
                    level={currentLevel + 1}
                    hintImage={hints[currentLevel]}
                    onSolved={handlePuzzleSolved}
                  />
                )}
              </AnimatePresence>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;
