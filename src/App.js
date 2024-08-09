
import {useState, useEffect} from 'react';
import HeroCard from './components/HeroCard'
  
const publicKey = 'baa801ec60e0791b83a121f2b9f3f11a';
const charactersUrl = 'https://gateway.marvel.com/v1/public/characters';
  
const App = () => {
const [heroes, setHeroes] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
  
const loadCharacters = async (search) => {
  const URL = `${charactersUrl}?limit=20&${search ? 'name=' + search + '&' : ''}apikey=${publicKey}`;

  const response = await fetch( URL);
  const data = await response.json();
  
  setHeroes(data.data.results);
}
  
useEffect(() => {
  loadCharacters();
}, []);
    
return (
  <div>
      <h1>Test</h1>
  
      <div className="search">
        <input 
          placeholder="Procure por heróis"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button 
          onClick={() => loadCharacters(searchTerm)}
        >
          search
        </button>
      </div>
  
      {
      heroes?.length > 0
        ? (
          <div className="">
            {heroes.map((hero) => (
              <HeroCard hero={hero} key={hero.id} />
            ))}
          </div>
        ) : (
          <div className="empty">
              <h2>Nenhum Herói foi encontrado</h2>
          </div>
        )
      }
    </div>
  );
}
  
export default App;
  