// components/GameBox.js

import React from 'react';
import "../app/globals.css"

const GameBox = ({ image, title, description, onClick }) => {
  return (
    <div className="game-box bg-black rounded-lg overflow-hidden border border-gray-300 p-4 m-4 cursor-pointer shadow-lg transition-transform transform hover:scale-105" onClick={onClick}>
      <img src={image} alt={title} className="max-w-full h-auto" />
      <h2 className="text-lg font-semibold mt-2 text-white">{title}</h2>
        <p className="mt-2 text-white">{description}</p>

    </div>
  );
};

export default GameBox;