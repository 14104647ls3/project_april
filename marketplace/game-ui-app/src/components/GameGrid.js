// components/GameGrid.js

import React, { useState } from 'react';
import GameBox from './GameBox';

const GameGrid = ({ initialGames }) => {
  const [games, setGames] = useState(initialGames);

  const loadMoreGames = () => {
    // Simulating loading more games from an API
    const newGames = [
      { id: 4, image: '/game4.jpg', title: 'Game 4', description: 'Description of Game 4' },
      { id: 5, image: '/game5.jpg', title: 'Game 5', description: 'Description of Game 5' },
    ];
    setGames(prevGames => [...prevGames, ...newGames]);
  };

  return (
    <div className="game-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {games.map(game => (
        <GameBox
          key={game.id}
          image={game.image}
          title={game.title}
          description={game.description}
          onClick={() => console.log(`Clicked on ${game.title}`)}
        />
      ))}
      <div className="load-more text-center cursor-pointer mt-8" onClick={loadMoreGames}>Load More</div>

    </div>
  );
};

export default GameGrid;
