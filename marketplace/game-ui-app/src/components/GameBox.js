// components/GameBox.js

import React from 'react';
import "../app/globals.css"

const GameBox = ({ id, image, title, description, price, onClick, offer, rank = "" }) => {
  if (id == '-1') {
    console.log("Key -1 detected")
    return
  }
  if (price == "Free") {
    return (
      <div className="game-box bg-black rounded-lg overflow-hidden border border-gray-300 p-4 m-4 cursor-pointer shadow-lg transition-transform transform hover:scale-105" onClick={onClick}>
        <h1 className="text-lg text-center font-semibold mt-2 text-white">{rank}</h1>
        <img src={image} alt={title} className="max-w-full h-auto" />
        <h2 className="text-lg font-semibold mt-2 text-white">{title}</h2>
        {/* <p className="mt-2 text-white">{description}</p> */}
        <p className="mt-2 text-white">{price}</p>
      </div>
    )
  }
  else {
    return (<div className="game-box bg-black rounded-lg overflow-hidden border border-gray-300 p-4 m-4 cursor-pointer shadow-lg transition-transform transform hover:scale-105" onClick={onClick}>
      <h1 className="text-lg text-center font-semibold mt-2 text-white">{rank}</h1>
      <img src={image} alt={title} className="max-w-full h-auto" />
      <h2 className="text-lg font-semibold mt-2 text-white">{title}</h2>
      {/* <p className="mt-2 text-white">{description}</p> */}
      <p className="mt-2 text-white">Steam Price: {price}</p>
      <p className="mt-2 text-white">Our Offer: {offer}</p>
    </div>)
  }
};

export default GameBox;