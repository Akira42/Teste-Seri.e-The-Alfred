
import {useState, useEffect} from 'react';
import './App.scss'
import HeroCard from './components/HeroCard'
import logo from './images/logo/Group.png';
  
const publicKey = 'baa801ec60e0791b83a121f2b9f3f11a';
const charactersUrl = 'https://gateway.marvel.com/v1/public/characters';
  
const App = () => {
const [heroes, setHeroes] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [loading, setLoading] = useState(false);
  
const loadCharacters = async (search) => {
  setLoading(true);
  const URL = `${charactersUrl}?limit=20&orderBy=-modified&${search ? 'nameStartsWith=' + search + '&' : ''}apikey=${publicKey}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    setHeroes(data.data.results);
  } catch (error) {
    console.error("Failed to fetch characters:", error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadCharacters(searchTerm);
}, []);
    
return (
  <main>
      <header className="header">
        <div className="container logo-wrapper">
          <a className="logo">
            <img src={logo} alt="Marvel Search heroes" />
          </a>

          <h1>Explore o Universo</h1>
          <h2>Mergulhe no domínio deslumbrante de todos os personagens clássicos que você ama - e aqueles que você descobrirá em breve!</h2>
        </div>

        <div className="container search">
          <form className="searchForm">
            <input type="button" value="Search" onClick={() => loadCharacters(searchTerm)}/>

            <input 
              placeholder="Procure por heróis"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </header>
      
      <div className="heroesList">
        <div className="container">
          {loading && <div className="load"></div>}

          {!loading && heroes.length === 0 && searchTerm && (
            <div className="empty">
              <h2>Nenhum Herói foi encontrado</h2>
            </div>
          )}

          {/* Display heroes */}
          <div className="heroes">
            {heroes.map((hero) => (
              <HeroCard hero={hero} key={hero.id} />
            ))}
          </div>

        </div>

        <div className="heroesListPagination">
          
        </div>
      </div>

      <footer className="footer"></footer>
    </main>
  );
}
  
export default App;
  