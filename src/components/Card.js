// Card.js

import React from 'react';

function Card({ image, onClick, isFlipped, number }) {
  return (
    <div
      onClick={onClick}
      className="card w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white border-2 border-gray-300 rounded-lg shadow-md hover:scale-105 transform transition-all cursor-pointer"
    >
      <div className={`w-full h-full ${isFlipped ? "bg-transparent" : "bg-gray-200"} rounded-lg flex items-center justify-center`}>
        {isFlipped ? (
          <img
            src={`/images/${image}`}
            alt="card"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-xl font-bold">{number}</span> // Display card number when not flipped
        )}
      </div>
    </div>
  );
}

export default Card;
