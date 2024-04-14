// pages/index.js

import "../app/globals.css"
import React from 'react';
import GameGrid from '../components/GameGrid';

const Home = ({ initialGames }) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Games</h1>
      <GameGrid initialGames={initialGames} />
    </div>
  );
};

export async function getServerSideProps() {
  // Simulate fetching games from an API
  const initialGames = [
    { id: 1, image: '/game1.jpg', title: 'Game 1', description: 'Description of Game 1' },
    { id: 2, image: '/game2.jpg', title: 'Game 2', description: 'Description of Game 2' },
    { id: 3, image: '/game3.jpg', title: 'Game 3', description: 'Description of Game 3' },
  ];

  return {
    props: {
      initialGames,
    },
  };
}

export default Home;
