import React from "react";
import GameBoard from "../components/GameBoard";
import ScoreBoard from "../components/ScoreBoard";

function GamePage() {
  return (
    <div className="game-page">
      <ScoreBoard />
      <GameBoard />
    </div>
  );
}

export default GamePage;
