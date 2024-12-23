import React, { useState, useEffect } from "react";
import "./App.css"; // Add your CSS styling here
import { Star } from 'lucide-react';
import Confetti from 'react-confetti';

// Import all the images
import owlImage from "./assets/owl.png";
import egg1Image from "./assets/egg1.png";
import egg2Image from "./assets/egg2.png";
import egg3Image from "./assets/egg3.png";
import backgroundImage from "./assets/bgimage.jpg"; // Background image
import bushImage from "./assets/bush.png"; // Hiding object (Bush)
import brokenEggImage from "./assets/broken-egg.png"; // Broken egg image
import monkeyImage from "./assets/bird.png"; // Hiding object (Monkey)
import birdImage from "./assets/monkey.png"; // Hiding object (Bird)

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [hintUsed, setHintUsed] = useState(false); // To track if hint was used
  const [hintAvailable, setHintAvailable] = useState(false); // To track if hint can be used
  const [eggsFound, setEggsFound] = useState(0); // Track number of eggs found
  const totalEggs = 3; // Total number of eggs to find
  const [showBrokenEgg, setShowBrokenEgg] = useState(false); // Show broken egg when all eggs are found
  const [owlMessage, setOwlMessage] = useState("Click on the object to find Easter eggs"); // Combined message displayed by the owl
  const [dialogueText, setDialogueText] = useState(
    "Identify the Easter egg locations! Click the owl for hints (1 hint = deduct 30 points)"
  );
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [foundEggs, setFoundEggs] = useState({
    monkey: false,
    parrot: false,
    bush: false
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const definitionLines = [
    "Under the bush",
    "Under the Parrot",
    "Under the monkey",
  ];

  const getHint = () => {
    if (eggsFound === 2) {
      if (foundEggs.monkey && foundEggs.parrot) {
        return "Under the bush";
      } else if (foundEggs.monkey && foundEggs.bush) {
        return "Under the monkey";
      } else if (foundEggs.parrot && foundEggs.bush) {
        return "Under the Parrot";
      }
    }
    return "Find more eggs first!";
  };

  // Timer logic
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    }
    if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setScore(0); // Reset score
    setTimeLeft(60); // Reset timer
    setGameStarted(true);
    setHintUsed(false); // Reset hint usage
    setHintAvailable(true); // Allow hint after the game starts
    setEggsFound(0); // Reset eggs found
    setShowBrokenEgg(false); // Hide broken egg
    setOwlMessage("Click on the object to find Easter eggs"); // Reset owl message
    setFoundEggs({
      monkey: false,
      parrot: false,
      bush: false
    });
    startShakeAnimation(); // Start shake animation
  };

  const startShakeAnimation = () => {
    const shakeInterval = setInterval(() => {
      setShake(!shake);
    }, 1000);
    setTimeout(() => clearInterval(shakeInterval), 10000); // Stop shaking after 10 seconds
  };

  const [shake, setShake] = useState(false); // State to trigger shake animation

  const shakeAnimation = {
    animation: shake ? "shake 0.5s" : "none",
    animationIterationCount: "infinite"
  };

  const playAgain = () => {
    setScore(0);
    setTimeLeft(60);
    setGameStarted(false);
    setEggsFound(0);
    setShowBrokenEgg(false);
    setOwlMessage("Click on the object to find Easter eggs");
    setFoundEggs({
      monkey: false,
      parrot: false,
      bush: false
    });
    
    // Reset visibility of all eggs and hiding objects
    const eggs = document.querySelectorAll('.object');
    const hidingObjects = document.querySelectorAll('.hiding-object');
    
    eggs.forEach(egg => {
      egg.style.display = 'block';
    });
    
    hidingObjects.forEach(obj => {
      obj.style.display = 'block';
    });

    // Start shake animation for the new game
    startShakeAnimation();
  };

  const endGame = () => {
    setGameStarted(false);
    setShowBrokenEgg(true);
  };

  const displayLineByLine = () => {
    if (currentLineIndex < definitionLines.length) {
      const line = definitionLines[currentLineIndex];
      setDialogueText(line);
      setCurrentLineIndex((prev) => prev + 1);
      setTimeout(displayLineByLine, 3000); // Display next line after 3 seconds
    } else {
      setDialogueText("The owl has finished speaking!");
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const findEgg = (points, event, location) => {
    if (event.target.style.display !== "none") {
      setScore((prev) => prev + points);
      event.target.style.display = "none"; // Hide the clicked egg
      setEggsFound((prev) => prev + 1); // Increment eggs found
      
      // Update which specific egg was found
      setFoundEggs(prev => ({
        ...prev,
        [location]: true
      }));

      if (eggsFound + 1 === totalEggs) {
        setShowBrokenEgg(true); // Show broken egg
        endGame(); // End game when all eggs are found
      }
    }
  };

  const findHidingObject = (points, event) => {
    if (event.target.style.display !== "none") {
      setScore((prev) => prev + points);
      event.target.style.display = "none"; // Hide the clicked object
    }
  };

  const hintDeduction = () => {
    if (hintAvailable && score >= 30 && !hintUsed && eggsFound === 2) {
      setScore((prev) => prev - 30);
      setHintUsed(true); // Mark hint as used
      setHintAvailable(false); // Disable further hint usage once one is used
      
      const hint = getHint();
      setOwlMessage(hint);
      speak(hint);
    } else if (score < 30) {
      setOwlMessage("Not enough points for a hint! Click on the object to find Easter eggs");
      setTimeout(() => setOwlMessage("Click on the object to find Easter eggs"), 3000);
      speak("Not enough points for a hint!");
    } else if (eggsFound < 2) {
      setOwlMessage("Find two eggs first to get a hint!");
      setTimeout(() => setOwlMessage("Click on the object to find Easter eggs"), 3000);
      speak("Find two eggs first to get a hint!");
    } else {
      setOwlMessage("You have already used a hint!");
      speak("You have already used a hint!");
    }
  };

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Confetti Effect when game is completed */}
      {showBrokenEgg && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={['#FFD700', '#FF69B4', '#00FF00', '#4169E1', '#FF4500', '#8A2BE2']}
        />
      )}

      {/* Timer and Score at the sides */}
      <div id="timer" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#FFD700',
        borderRadius: '10px',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>Time: {timeLeft}</div>
      <div id="scoreboard" style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#00FF00',
        borderRadius: '10px',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>Score: {score}</div>

      {/* Start button - only show if game hasn't started and reward isn't showing */}
      {!gameStarted && !showBrokenEgg && (
        <button
          className="start-button"
          style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
          onClick={startGame}
        >
          Start Game
        </button>
      )}

      {/* Broken Egg and Score Container */}
      {showBrokenEgg && (
        <div id="broken-egg-container" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
          color: "#333",
          minWidth: "300px",
          animation: "popIn 0.5s ease-out"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <Star color="gold" size={48} style={{ marginBottom: "10px" }} />
            <img 
              src={brokenEggImage} 
              alt="Broken Egg" 
              style={{ 
                width: "150px",
                marginTop: "10px",
                animation: "bounce 1s infinite"
              }} 
            />
          </div>
          <h2 style={{
            color: '#FF4081',
            fontSize: '28px',
            marginBottom: '15px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>Congratulations!</h2>
          <p style={{
            color: '#2196F3',
            fontSize: '20px',
            marginBottom: '20px'
          }}>Your final score is: {score}</p>
          <button onClick={playAgain} style={{
            marginTop: "20px",
            padding: "12px 30px",
            backgroundColor: "#FF4081",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(255,64,129,0.3)",
            transition: "all 0.3s ease",
            ':hover': {
              backgroundColor: "#E91E63",
              transform: "scale(1.05)"
            }
          }}>Play Again</button>
        </div>
      )}

      {/* Exit Button */}
      <button style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        padding: '10px 25px',
        backgroundColor: '#FF4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(255,68,68,0.3)',
        transition: 'all 0.3s ease',
        zIndex: 100,
      }}>
        Exit Game
      </button>

      {/* Owl */}
      <img
        src={owlImage}
        id="owl"
        alt="Owl"
        style={{
          position: "absolute",
          top: "10%", // Adjust this value to change its vertical position
          left: "10%", // Adjust this value to change its horizontal position
          cursor: "pointer",
          zIndex: 20,
          width: "8%",
        }}
        onClick={hintDeduction} // Owl provides hints and deducts points
      />

      {/* Owl Dialogue Box */}
      {owlMessage && (
        <div id="owl-dialogue" style={{
          position: "absolute",
          top: "15%",
          left: "18%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "15px",
          borderRadius: "15px",
          color: "#FFD700",
          maxWidth: "250px",
          textAlign: "center",
          zIndex: 30,
          fontSize: "16px",
          fontWeight: "500",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          border: "2px solid #FFD700"
        }}>
          {owlMessage}
        </div>
      )}

      {/* Hiding objects */}
      <img
        src={monkeyImage}
        className="hiding-object glow-effect"
        style={{
          position: "absolute",
          top: "36%",
          left: "80%",
          width: "10%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
          ...shakeAnimation
        }}
        onClick={(e) => gameStarted && findHidingObject(10, e)}
        alt="Monkey"
      />
      <img
        src={birdImage}
        className="hiding-object glow-effect"
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "10%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
          ...shakeAnimation
        }}
        onClick={(e) => gameStarted && findHidingObject(15, e)}
        alt="Bird"
      />
      <img
        src={bushImage}
        className="hiding-object glow-effect"
        style={{
          position: "absolute",
          top: "70%",
          left: "20%",
          width: "10%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
          ...shakeAnimation
        }}
        onClick={(e) => gameStarted && findHidingObject(20, e)}
        alt="Bush"
      />
      <img
        src={egg1Image}
        className="object"
        id="egg1"
        style={{
          position: "absolute",
          top: "37%",
          left: "81%",
          width: "3%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
        }}
        onClick={(e) => gameStarted && findEgg(10, e, 'monkey')}
        alt="Egg 1"
      />
      <img
        src={egg2Image}
        className="object"
        id="egg2"
        style={{
          position: "absolute",
          top: "51%",
          left: "63%",
          width: "5%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
        }}
        onClick={(e) => gameStarted && findEgg(20, e, 'parrot')}
        alt="Egg 2"
      />
      <img
        src={egg3Image}
        className="object"
        id="egg3"
        style={{
          position: "absolute",
          top: "75%",
          left: "22%",
          width: "5%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
        }}
        onClick={(e) => gameStarted && findEgg(15, e, 'bush')}
        alt="Egg 3"
      />
    </div>
  );
}

export default App;
