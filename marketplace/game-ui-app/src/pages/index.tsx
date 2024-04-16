// pages/index.js

import "../app/globals.css"
import React from 'react';
import GameGrid from '../components/GameGrid';
import {loadGames, loadGameIds} from './api/steam';


export async function getStaticProps() {
  // Simulate fetching games from an API
  // API for all app name and ids: https://api.steampowered.com/ISteamApps/GetAppList/v0002/

  let initialGames = await loadGames();
  console.log(initialGames)
  return {
    props: {
      initialGames,
    },
  };
}

const Home = ({ initialGames }) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Game Offers</h1>
      <GameGrid initialGames={initialGames}/>
    </div>
  );
};

export default Home;
