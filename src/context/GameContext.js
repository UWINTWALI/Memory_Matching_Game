import React, { createContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("start");

  return (
    <GameContext.Provider value={{ score, setScore, gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};
