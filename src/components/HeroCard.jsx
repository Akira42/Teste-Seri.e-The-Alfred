import React, { useEffect } from 'react';
import {addToFavorites} from '../functions';

const HeroCard = ({ hero, showCharacterInfo }) => {
  useEffect(() => {
    const favoriteHeroes = JSON.parse(localStorage.getItem('Favorite Heroes')) || [];

    favoriteHeroes.forEach(heroId => {
      const heroElement = document.querySelector(`[data-id="${heroId}"]`);
      if (heroElement) {
        heroElement.querySelector('.heroName').classList.add('favorited');
      }
    }); 
  }, []);
  
  return (
    <div className="hero">
      <a className="heroLink" data-id={`heroid${hero.id}`} onClick={() => showCharacterInfo(`${hero.id}`)}>
        <img className="heroThumb" src={hero.thumbnail.path !== '' ? hero.thumbnail.path + '/standard_fantastic.' + hero.thumbnail.extension : 'https://via.placeholder.com/400'} alt={hero.name} />

        <div className="heroName">
          <h3>{hero.name}</h3>

          <button className='' onClick={(e) => addToFavorites(`heroid${hero.id}`, e)}></button>
        </div>
      </a>
    </div>
  );
}

export default HeroCard;