import React, { useEffect } from 'react';
import addToFavorites from '../functions';

const HeroCard = ({ hero }) => {
  useEffect(() => {
    // Retrieve favorite heroes from localStorage
    const favoriteHeroes = JSON.parse(localStorage.getItem('Favorite Heroes')) || [];

    // Iterate over each favorite hero ID
    favoriteHeroes.forEach(heroId => {
      // Select the element that corresponds to this hero ID using data-id attribute
      const heroElement = document.querySelector(`[data-id="${heroId}"]`);
      if (heroElement) {
        // Add the 'favorited' class to the element
        heroElement.classList.add('favorited');
      }
    });
  }, []); // Empty dependency array ensures this runs only once after the component mounts
  
  return (
    <div className="hero">
      <a className="heroLink" data-id={`heroid${hero.id}`}>
        <img className="heroThumb" src={hero.thumbnail.path !== '' ? hero.thumbnail.path + '/standard_fantastic.' + hero.thumbnail.extension : 'https://via.placeholder.com/400'} alt={hero.name} />

        <h3>{hero.name}</h3>

        <button className='' onClick={(e) => addToFavorites(`heroid${hero.id}`, e)}></button>
      </a>
    </div>
  );
}

export default HeroCard;