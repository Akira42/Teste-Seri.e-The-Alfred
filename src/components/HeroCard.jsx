import React from 'react';

const HeroCard = ({ hero }) => {
  return (
      <div className="hero">
        <a className="">
          <img src={hero.thumbnail.path !== '' ? hero.thumbnail.path + '.' + hero.thumbnail.extension : 'https://via.placeholder.com/400'} alt={hero.name}/>
          
          <h3>{hero.name}</h3>
        </a>
      </div>
  );
}

export default HeroCard;
