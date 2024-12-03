import { useState, useContext } from "react";
import { GameContext } from "../context/GameContext";

const useGameLogic = () => {
  const { score, setScore } = useContext(GameContext);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const handleMatch = () => {
    setScore(score + 10);
    setMatchedPairs(matchedPairs + 1);
  };

  return { score, matchedPairs, handleMatch };
};

export default useGameLogic;
