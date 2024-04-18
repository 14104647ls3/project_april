// pages/index.js
import React from 'react';
import "../app/globals.css"
import GameGrid from '../components/GameGrid';
import {loadGames, loadGameIds} from './api/steam';

export async function getServerSideProps(context) {
  const { id1, id2, id3, id4, id5, id6, id7, id8, id9 } = context.query;
  // const games = await loadGameIds([id1, id2, id3, id4, id5, id6, id7, id8, id9])
  const games = await loadGameIds([id1, id2, id3, id4, 1771180, 2025780, 1156380, 2127230, 1141580, 1337970])
  return {
    props: {
      games: games
    },
  };
}

export default function Recommend({ games }) {
    return (
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold my-8">Check out our recommendations!</h1>
            <GameGrid initialGames={games}/>
        </div>
    );
}