import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import ScoreBoard from './ScoreBoard';

function GameBoard() {
  const shuffleCards = useCallback(() => {
    const initialCards = [
      "apple.jpg", "banana.jpg", "orange.jpg", "grape.jpg", 
      "apple.jpg", "banana.jpg", "orange.jpg", "grape.jpg"
    ];

    const shuffledCards = [...initialCards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    setCards(shuffledCards);
  }, []);

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Flip card function
  const handleFlip = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedCards.includes(index)) {
      return; // Prevent flipping if two cards are already flipped or if the card is matched
    }

    // Add the index to flippedIndices
    setFlippedIndices((prev) => [...prev, index]);
  };

  // Check if cards match
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
        setScore((prev) => prev + 1);
        // Reset flipped indices immediately after a successful match
        setFlippedIndices([]);
      } else {
        // If not a match, reset flippedIndices after a delay
        const timeoutId = setTimeout(() => {
          setFlippedIndices([]);
        }, 1000); // Delay reset to show unmatched cards for 1 second

        return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or before running this effect again
      }
    }
  }, [flippedIndices, cards]);

  // Shuffle cards when component mounts
  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  // Check for game over (all cards matched)
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true); // Set game over when all pairs are matched
    }
  }, [matchedCards, cards]);
  

  return (
    <div className="">
      <p className='flex'><strong>Score: </strong><span><ScoreBoard score={ score}/></span></p>
      
    <div className="game-board grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 p-4">
      {cards.map((image, index) => (
        <Card
        key={index}
        image={image}
        onClick={() => handleFlip(index)}
        isFlipped={flippedIndices.includes(index) || matchedCards.includes(index)}
        />
      ))}
      {gameOver && (
        <div className="text-center text-xl mt-4">
          You Win! All Cards Matched!
        </div>
      )}
      </div>
    </div>
  );
}

export default GameBoard;