// components/GameGrid.js

import React, { useState } from 'react';
// import GameBox from './GameBox';
import dynamic from 'next/dynamic'

const GameBox = dynamic(() => import('./GameBox'))
const GameGrid = ({initialGames}) => {
  const [games, setGames] = useState(initialGames);

  const loadMoreGames = () => {
    // Simulating loading more games from an API
    setGames(prevGames => [...prevGames, ...newGames]);
  };

  if (typeof games !== "undefined") {
    return (
      <div className="game-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {games.map(game => (
          <GameBox
            key={game.id}
            id={game.id}
            rank={game.rank}
            image={game.image}
            title={game.title}
            description={game.description}
            price={game.price}
            offer={game.offer}
            onClick={() => window.open(`${"https://store.steampowered.com/app/" + game.id}`)}
          />
        ))}
        <button onClick={() => loadMoreGames()}>Load More</button>
      </div>
    )
  }
  else {
    return
  }
};

export default GameGrid;
