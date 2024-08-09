let favoriteHeroes = [];

const addToFavorites = (favoriteHeroId, event) => {
  // Retrieve and parse the existing favorite heroes from localStorage
  favoriteHeroes = JSON.parse(localStorage.getItem('Favorite Heroes')) || [];

  // Check if the hero is already in the favorites
  if (favoriteHeroes.includes(favoriteHeroId)) {
    // Remove the hero from favorites
    favoriteHeroes = favoriteHeroes.filter(item => item !== favoriteHeroId);
    event.target.parentNode.classList.remove('favorited');
  } else {
    // Check if the favorites list is full
    if (favoriteHeroes.length < 5) {
      // Add the hero to favorites
      favoriteHeroes.push(favoriteHeroId);
      event.target.parentNode.classList.add('favorited');
    } else {
      alert('Você só pode adicionar 5 heróis em sua lista de favoritos! Remova um ou mais para adicionar novos.');
      return; // Exit function early if the list is full
    }
  }

  // Update localStorage with the new favorites list
  localStorage.setItem('Favorite Heroes', JSON.stringify(favoriteHeroes));

  // Log the updated favorites list
  console.log(favoriteHeroes);
};

export default addToFavorites;