import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Kids Picture Matching Game</h1>
      <Link to="/game">
        <button className="start-button">Start Game</button>
      </Link>
    </div>
  );
}

export default HomePage;
