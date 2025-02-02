import '../styles/game.css'; 
import React, { useState, useEffect, useCallback } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import Card from './Card'; 
import ScoreBoard from './ScoreBoard'; 
import confetti from 'canvas-confetti'; 

function GameBoard() { 
    const location = useLocation(); 
    const { username } = location.state || {}; 
    const [cards, setCards] = useState([]); 
    const [flippedIndices, setFlippedIndices] = useState([]); 
    const [matchedCards, setMatchedCards] = useState([]); 
    const [score, setScore] = useState(0); 
    const [gameOver, setGameOver] = useState(false); 
    const [level, setLevel] = useState(1); 
    const [audio, setAudio] = useState(null); 
    const [selectedMusic, setSelectedMusic] = useState('/sounds/PraiseInstrumental.mp3'); 

    // New state variables for accuracy tracking 
    const [totalAttempts, setTotalAttempts] = useState(0); 
    const [correctMatches, setCorrectMatches] = useState(0); 

    // Shuffle cards based on current level 
    const shuffleCards = useCallback(() => { 
        const initialCards = []; 
        const images = [ 
            'apple.jpg', 'banana.jpg', 'orange.jpg', 'grape.jpg', 'cherry.jpg', 
            'pear.jpg', 'melon.jpg', 'peach.jpg', 'bird.jpg', 'dog.jpg', 
            'dog_1.jpg', 'inkeri.jpg', 'tomato.jpg', 'mango.jpg', 'baterfly.jpg', 
            'pandas.jpg', 'redpandas.jpg', 'kangaroo.webp', 'rabbit.jpg', 'bee.webp','bee.jpg',
        ]; 

        // Calculate total cards based on level 
        const totalCards = 4 * (level + 1); // Start with 8 cards at level 1 (2x4) 
        const numPairs = totalCards / 2; // Number of pairs needed 

        // Ensure we do not exceed available images 
        const levelCards = images.slice(0, Math.min(numPairs, images.length)); 
        initialCards.push(...levelCards, ...levelCards); // Create pairs 

        // Shuffle cards 
        const shuffledCards = [...initialCards]; 
        for (let i = shuffledCards.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]]; 
        } 

        // Set exactly totalCards amount 
        setCards(shuffledCards.slice(0, totalCards)); 
    }, [level]); 

    const handleFlip = (index) => { 
        if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedCards.includes(index)) { return; } 
        
        setFlippedIndices((prev) => [...prev, index]); 
        
        // Increment total attempts for every flip 
        setTotalAttempts((prev) => prev + 1); 
    }; 

    useEffect(() => { 
        if (flippedIndices.length === 2) { 
            const [firstIndex, secondIndex] = flippedIndices; 

            if (cards[firstIndex] === cards[secondIndex]) { 
                setMatchedCards((prev) => [...prev, firstIndex, secondIndex]); 
                setScore((prev) => prev + 10); // Increase score by 10 for a correct match 

                // Increment correct matches
                setCorrectMatches((prev) => prev + 1); 

                // Reset flipped indices
                setFlippedIndices([]); 

                // Play success sound and lower background music
                const successSound = new Audio('/sounds/Successsoundeffect.mp3'); 
                successSound.volume = 1.0; // Full volume for success sound
                successSound.play(); 

                if (audio) { 
                    audio.volume = 0.1; // Reduce background music volume
                    setTimeout(() => { audio.volume = 0.5; }, 1500); // Restore after 1.5 seconds
                } 
            } else {  
                setScore((prev) => Math.max(0, prev - 1)); // Decrease score by 1 for an incorrect match
                const timeoutId = setTimeout(() => { setFlippedIndices([]); }, 1000);
                return () => clearTimeout(timeoutId);
            }  
        }  
    }, [flippedIndices, cards, audio]); 

    useEffect(() => { shuffleCards(); }, [shuffleCards]); 

    // Function to launch fireworks
    const launchFireworks = () => {  
        for (let i = 0; i < 10; i++) {  
            setTimeout(() => {  
                confetti({ particleCount: 400, spread: 160, startVelocity: 80, angle: Math.random() * 360, origin: { x: Math.random(), y: Math.random() * 0.6 }, zIndex: 1000 });  
            }, i * 300);  
        }  
    }; 

    // Check for game over condition
    useEffect(() => {  
        if (matchedCards.length === cards.length && cards.length > 0) {  
            setGameOver(true);  
            launchFireworks();  
            new Audio('/sounds/crowdcheersound.mp3').play();  
        }  
    }, [matchedCards, cards]); 

    // Play intro music when the game starts
    useEffect(() => {  
        const bgMusic = new Audio(selectedMusic);  
        bgMusic.loop = true;  
        bgMusic.volume = 0.5;  
        bgMusic.play().catch((error) => console.error('Failed to play intro music:', error));  
        
        setAudio(bgMusic); 
        
        return () => {  
            bgMusic.pause();  
            bgMusic.currentTime = 0; // Reset music when the component unmounts
        };  
    }, [selectedMusic]); 

    const toggleMusic = () => {  
        if (audio) { audio.paused ? audio.play() : audio.pause(); }  
    }; 
    
    const nextLevel = () => {  
        setLevel((prev) => prev + 1);  
        setMatchedCards([]);  
        setFlippedIndices([]);  
        setScore(0);  
        setGameOver(false);  
        
        shuffleCards(); 
        
        // Reset attempts and correct matches for the new level
        setTotalAttempts(0);  
        setCorrectMatches(0);  
    }; 
    
    // Calculate accuracy percentage
    const calculateAccuracy = () => {  
        if (totalAttempts === 0) return "N/A"; // Avoid division by zero
        return (((correctMatches * 2) / totalAttempts) * 100).toFixed(2); // Format to two decimal places
    }; 
    
    // Calculate attention span based on accuracy
    const calculateAttentionSpan = () => {
        const accuracyPercentage = calculateAccuracy();
        
        if (accuracyPercentage === "N/A") return "N/A"; // avoid calculation if no attempts
        
        let accuracyValue = parseFloat(accuracyPercentage);
        
        return ((accuracyValue / 50) * 8.25).toFixed(2) + " seconds"; // Calculate attentoin span based on accuracy
    };

    return (   
      <div className="game-container" style={{ display: 'flex' }}>     
          {/* Level Selection Pane */}     
          <div className="level-selection" style={{ width: '140px', marginRight: '120px' }}>       
              <h3>Select Level:</h3>       
              {[...Array(9)].map((_, index) => (         
                  <button key={index} onClick={() => {setLevel(index + 1); shuffleCards();}}> Level {index + 1} </button>       
              ))}     
          </div>      
          {/* Upper Settings Container */}     
          <div style={{ flexGrow: '1' }}>       
              <div className="settings-container">         
                  {username && <h2>Hello, {username}!</h2>}         
                  <h2>Ready To Become The Champion! All You Need Is Attention <span style={{ fontSize: '30px' }}>💪🏆</span></h2>         
                  {/* Buttons and Scoreboard in a flex container */}         
                  <div style={{ display: 'flex', alignItems: 'center' }}>           
                      <label htmlFor="music-select">Choose your intro music:</label>           
                      <select id="music-select" value={selectedMusic} onChange={(e) => setSelectedMusic(e.target.value)} style={{ marginLeft: '10px' }}>             
                          <option value="/sounds/BetterDaysBensound.mp3">Better Days</option>             
                          <option value="/sounds/PraiseInstrumental.mp3">Praise</option>             
                          <option value="/sounds/bensoundukulelehappyroyalty.mp3">Happy Royalty</option>           
                      </select>           
                      <button onClick={toggleMusic} className="p-2 bg-gray-400 rounded" style={{ marginLeft: '10px' }}>             
                          {audio?.paused ? 'Play Music' : 'Pause Music'}           
                      </button>           
                      {/* Scoreboard on the right side */}           
                      <div className="scoreboard ml-auto">             
                          <p className="block"> <strong>Score:</strong> <span><ScoreBoard score={score} /></span> </p>             
                          <p className="block"> <strong>Level:</strong> <span>{level}</span> </p>             
                          <p className="block"> <strong>Accuracy:</strong> <span>{calculateAccuracy()}%</span> </p>
                          {/* Display calculated attention span */}
                          <p className="block"> <strong>Attention Span:</strong> <span>{calculateAttentionSpan()}</span> </p>
                      </div>         
                  </div>       
              </div>       
              {/* Grid Container with No Background */}       
              <div className="game-board">         
                  {cards.map((image, index) => (           
                      <Card key={index} image={image} onClick={() => handleFlip(index)} isFlipped={flippedIndices.includes(index) || matchedCards.includes(index)} number={index + 1} />         
                  ))}       
              </div>       
              {gameOver && (         
                  <div className="text-center text-xl mt-4">           
                      <p className="text-white text-xl font-bold">You Win! All Cards Matched!</p>           
                      <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={nextLevel}> Next Level </button>         
                  </div>
              )}     
          </div>
      </div>
   );   
}

export default GameBoard;
