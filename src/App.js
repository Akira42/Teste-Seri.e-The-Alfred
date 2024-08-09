import { useState, useEffect } from 'react';
import './App.scss';
import HeroCard from './components/HeroCard';
import logo from './images/logo/Group.png';
import lupa from './images/busca/Lupa/Shape@1,5x.svg';

const publicKey = 'baa801ec60e0791b83a121f2b9f3f11a';
const charactersUrl = 'https://gateway.marvel.com/v1/public/characters';

const App = () => {
  const [heroes, setHeroes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cache, setCache] = useState({});

  const loadCharacters = async (search, page) => {
    const cacheKey = `${search || 'default'}-${page}`;
    if (cache[cacheKey]) {
      setHeroes(cache[cacheKey].results);
      setTotalPages(cache[cacheKey].pages);
      setCurrentPage(page);
      return;
    }

    const paginationOffset = page * 20;
    const URL = `${charactersUrl}?limit=20&offset=${paginationOffset}&orderBy=-modified&${search ? 'nameStartsWith=' + search + '&' : ''}apikey=${publicKey}`;

    setLoading(true);
    setHeroes([]);

    try {
      const response = await fetch(URL);
      const data = await response.json();
      const totalResults = data.data.total;
      const pages = Math.ceil(totalResults / 20);

      setHeroes(data.data.results);
      setTotalPages(pages);
      setCurrentPage(page);

      setCache(prevCache => ({
        ...prevCache,
        [cacheKey]: {
          results: data.data.results,
          pages: pages
        }
      }));
    } catch (error) {
      console.error("Failed to fetch characters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedSearchTerm = localStorage.getItem('searchTerm');
    const page = currentPage;

    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
      loadCharacters(savedSearchTerm, page);
    } else {
      loadCharacters('', page);
    }
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    loadCharacters(searchTerm, 0);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      loadCharacters(searchTerm, page);
    }
  };

  const paginationButtons = () => {
    const totalButtonCount = totalPages;
    const startPage = Math.max(0, currentPage - Math.floor(totalButtonCount / 2));
    const endPage = Math.min(startPage + totalButtonCount - 1, totalPages - 1);

    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

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
          <form className="searchForm" onSubmit={handleSubmit}>
            <button className="searchButton" type="submit" value="Search">
              <img src={lupa} />
            </button>
            <input
              className="searchInput"
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

          <div className="heroes">
            {heroes.map((hero) => (
              <HeroCard hero={hero} key={hero.id} />
            ))}
          </div>
        </div>

        {!loading && (
          <div className="container heroesListPagination">
            {paginationButtons()}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Data provided by Marvel. © 2014 Marvel</p>
      </footer>
    </main>
  );
};

export default App;