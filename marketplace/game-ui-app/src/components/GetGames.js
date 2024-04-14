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