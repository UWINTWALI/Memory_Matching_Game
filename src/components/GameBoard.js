import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import ScoreBoard from './ScoreBoard';
import confetti from 'canvas-confetti';

function GameBoard() {
  const location = useLocation();
  const { username } = location.state || {}; // Get the username from the location state

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [audio, setAudio] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState('/sounds/BetterDaysBensound.mp3'); // Default music

  const shuffleCards = useCallback(() => {
    const initialCards = [];
    const images = [
      'apple.jpg', 'banana.jpg', 'orange.jpg', 'grape.jpg',
      'cherry.jpg', 'pear.jpg', 'melon.jpg', 'peach.jpg', 'bird.jpg',
    ];
    const levelCards = images.slice(0, level + 2);
    initialCards.push(...levelCards, ...levelCards);

    const shuffledCards = [...initialCards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    setCards(shuffledCards);
  }, [level]);

  const handleFlip = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedCards.includes(index)) {
      return;
    }
    setFlippedIndices((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
        setScore((prev) => prev + 1);
        setFlippedIndices([]);

        // Play success sound and lower background music
        const successSound = new Audio('/sounds/Successsoundeffect.mp3');
        successSound.volume = 1.0; // Full volume for success sound
        successSound.play();

        if (audio) {
          audio.volume = 0.1; // Reduce background music volume
          setTimeout(() => {
            audio.volume = 0.5; // Restore background music volume after 1.5 seconds
          }, 1500);
        }
      } else {
        const timeoutId = setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [flippedIndices, cards, audio]);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  // Function to launch fireworks
  const launchFireworks = () => {
    for (let i = 0; i < 15; i++) { // Increased number of bursts
      setTimeout(() => {
        confetti({
          particleCount: 400, // High particle count
          spread: 160, // Wide dispersion
          startVelocity: 80, // Fast confetti
          angle: Math.random() * 360, // Random directions
          origin: {
            x: Math.random(), // Random X positions
            y: Math.random() * 0.6, // Random Y positions (top 60% of the screen)
          },
          zIndex: 1000, // Above other elements
        });
      }, i * 300); // Stagger each burst by 300ms
    }
  };

  // Trigger fireworks when the game is over (all cards matched)
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
      launchFireworks();
    }
  }, [matchedCards, cards]);

  // Play intro music when the game starts
  useEffect(() => {
    const bgMusic = new Audio(selectedMusic);
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play().catch((error) => {
      console.error('Failed to play intro music:', error);
    });
    setAudio(bgMusic);

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0; // Reset music when the component unmounts
    };
  }, [selectedMusic]); // This effect will run whenever the selected music changes

  const toggleMusic = () => {
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setMatchedCards([]);
    setFlippedIndices([]);
    setScore(0);
    setGameOver(false);
    shuffleCards();
    // Optionally, trigger fireworks for the next level or on other specific conditions.
  };

  return (
    <div className="game-container">
      {username && <h2>Hello, {username}!</h2>}
      <p className="flex">
        <strong>Score:</strong> <span><ScoreBoard score={score} /></span>
      </p>
      <p className="flex">
        <strong>Level:</strong> <span>{level}</span>
      </p>
      
      {/* Music selection dropdown */}
      <label htmlFor="music-select">Choose your intro music:</label>
      <select 
        id="music-select" 
        value={selectedMusic} 
        onChange={(e) => setSelectedMusic(e.target.value)}
      >
        <option value="/sounds/BetterDaysBensound.mp3">Better Days</option>
        <option value="/sounds/PraiseInstrumental.mp3">Praise</option>
        <option value="/sounds/bensoundukulelehappyroyalty.mp3">Happy Royalty</option>
      </select>
      
      <button onClick={toggleMusic} className="p-2 bg-gray-200 rounded">
        {audio?.paused ? 'Play Music' : 'Pause Music'}
      </button>
      
      <div className="game-board grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 p-4">
        {cards.map((image, index) => (
          <Card
            key={index}
            image={image}
            onClick={() => handleFlip(index)}
            isFlipped={flippedIndices.includes(index) || matchedCards.includes(index)}
          />
        ))}
      </div>
      {gameOver && (
        <div className="text-center text-xl mt-4">
          <p>You Win! All Cards Matched!</p>
          <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={nextLevel}>
            Next Level
          </button>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
