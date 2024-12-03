import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

function HomePage() {
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate(); // Create a navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsSubmitted(true);
      navigate("/game", { state: { username } }); // Use navigate to redirect with state
    }
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Kids Picture Matching Game</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Enter your username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <button type="submit" className="start-button">Start Game</button>
        </form>
      ) : (
        <p>Welcome, {username}!</p>
      )}
    </div>
  );
}

export default HomePage;
