// components/GameGrid.js

import React, { useState } from 'react';
import GameBox from './GameBox';

const GameGrid = ({initialGames}) => {
  const [games, setGames] = useState(initialGames);

  const loadMoreGames = (newGames) => {
    // Simulating loading more games from an API
    setGames(prevGames => [...prevGames, ...newGames]);
  };

  // console.log(loadGames())

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
      </div>
    )
  }
  else {
    return
  }
};

export default GameGrid;
