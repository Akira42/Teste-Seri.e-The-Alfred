import { useState, useEffect } from 'react';
import {showCharacterInfo} from '../App';

const HeroInfoPage = ({ hero }) => {    
    // const [heroData, setHeroData] = useState();

    return (
        <div className="heroInfoPage">
            <div className="heroInfoPageHeader">
                {hero.id}
            </div>
        </div>
    );
}
  
export default HeroInfoPage;