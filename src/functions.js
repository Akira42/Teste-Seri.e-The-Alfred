let favoriteHeroes = [];

export const addToFavorites = (favoriteHeroId, event) => {
  favoriteHeroes = JSON.parse(localStorage.getItem('Favorite Heroes')) || [];

  if (favoriteHeroes.includes(favoriteHeroId)) {
    favoriteHeroes = favoriteHeroes.filter(item => item !== favoriteHeroId);
    event.target.parentNode.classList.remove('favorited');
  } else {
    if (favoriteHeroes.length < 5) {
      favoriteHeroes.push(favoriteHeroId);
      event.target.parentNode.classList.add('favorited');
    } else {
      alert('Você só pode adicionar 5 heróis em sua lista de favoritos! Remova um ou mais para adicionar novos.');
      return;
    }
  }

  localStorage.setItem('Favorite Heroes', JSON.stringify(favoriteHeroes));
  console.log(favoriteHeroes);
};

