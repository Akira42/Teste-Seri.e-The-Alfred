import React from 'react';

const HeroCard = ({ hero }) => {
    return (
        <div className="hero">
          <div className="">
            <p>{hero.name}</p>

            <img src={hero.thumbnail.path !== '' ? hero.thumbnail.path + '.' + hero.thumbnail.extension : 'https://via.placeholder.com/400'} alt={hero.name}/>
          </div>
        </div>
    );
}

export default HeroCard;
