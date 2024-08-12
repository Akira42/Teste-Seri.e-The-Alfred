import { useState, useEffect, useRef } from 'react';
import './App.scss';
import HeroCard from './components/HeroCard';
import {addToFavorites} from './functions';

import logo from './images/logo/Group.png';
import lupa from './images/busca/Lupa/Shape@1,5x.svg';
import heart from './images/icones/heart/heart-filled-2x.png';
import heroIcon from './images/icones/heroi/noun_Superhero_2227044.png';

import quadrinhos from './images/icones/book/Group.png';
import filmes from './images/icones/video/Shape.png';
import review from './images/review/Group 4.png';

const publicKey = 'baa801ec60e0791b83a121f2b9f3f11a';
const charactersUrl = 'https://gateway.marvel.com/v1/public/characters';

const App = () => {
  const [heroes, setHeroes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteHeroes, setFavoriteHeroes] = useState([]);
  const [totalCharactersCount, setTotalCharactersCount] = useState(0);
  const [isToggled, setIsToggled] = useState(false);
  const [heroInfo, setHeroInfo] = useState([]);
  const [heroComics, setHeroComics] = useState([]);
  const [heroComicsTotal, setHeroComicsTotal] = useState([]);
  const [error, setError] = useState(null);
  const [showHeroInfo, setShowHeroInfo] = useState(false);
  const isFirstRender = useRef(true);

  const showCharacterInfo = async (heroId) => {
    setShowHeroInfo(true);
    const URL = `${charactersUrl}/${heroId}?apikey=${publicKey}`;
    const URLComics = `${charactersUrl}/${heroId}/comics?orderBy=-onsaleDate&limit=10&apikey=${publicKey}`;
    const heroesInfoElement = document.getElementsByClassName('heroesInfo')[0];

    if (heroesInfoElement) {
      heroesInfoElement.style.display = 'block';
    } else {
      console.error("Element com a classe 'heroesInfo' não foi encontrado.");
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Failed to fetch character info");
      }
      const data = await response.json();
      const responseComics = await fetch(URLComics);
      if (!responseComics.ok) {
        throw new Error("Failed to fetch character info");
      }
      const dataComics = await responseComics.json();
      setHeroComics(dataComics.data.results);
      setHeroComicsTotal(dataComics.data.total);
      setHeroInfo(data.data.results[0]);
      
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch character info:", error);
    } finally {
      
      setLoading(false);
    }
  };
  
  const loadCharacters = async (search, page) => {
    const paginationOffset = page === 0 ? 0 : page * 20;
    const URL = `${charactersUrl}?limit=20&offset=${paginationOffset || '0'}&orderBy=${isToggled ? '-name' : 'name'}&${search ? 'nameStartsWith=' + search + '&' : ''}apikey=${publicKey}`;
    setLoading(true);
    setHeroes([]);
    try {
      const response = await fetch(URL);
      const data = await response.json();
      const totalResults = data.data.total;
      const pages = Math.ceil(totalResults / 20);
      setHeroes(data.data.results);
      setTotalCharactersCount(data.data.total);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    const favoriteHeroIds = JSON.parse(localStorage.getItem('Favorite Heroes')) || [];
    const favoriteHeroesData = [];
    try {
      let index = 0;
      for(let heroId of favoriteHeroIds) {
        index = index + 1;
        const response = await fetch(`${charactersUrl}/${heroId.replace('heroid', '')}?apikey=${publicKey}`);
        const data = await response.json();
        if (data.data.results.length > 0) {
          favoriteHeroesData.push(data.data.results[0]);
        }
        setTotalCharactersCount(index);
      }
      setFavoriteHeroes(favoriteHeroesData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch favorite characters:", error);
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
  const handleShowOnlyFavorites = () => {
    setShowOnlyFavorites(prevState => !prevState);
    if (!showOnlyFavorites) {
      loadFavorites();
    }
  };

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
    const buttons = [];
    for (let i = currentPage - 3; i <= currentPage + 3; i++) {
      if(i + 1 > 0){
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
    }
    return buttons;
  };

  const displayedHeroes = showOnlyFavorites ? favoriteHeroes : heroes;

  const handleToggle = () => {
    const nextToggleState = !isToggled;
    setIsToggled(nextToggleState);
    setCurrentPage(0);
  };


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      loadCharacters(searchTerm, 0);
    }
  }, [isToggled]);

  const handleDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    let formattedDate = date.toLocaleDateString('pt-BR', options);
    formattedDate = formattedDate.replace(/(\w{3})/, '$1.');

    return formattedDate;
  };

  const handleHeroPageFavorited = (heroId) => {
    const favoritedHeroesList = JSON.parse(localStorage.getItem('Favorite Heroes')) || [];
    for (let hero of favoritedHeroesList) {
      if (hero.replace('heroid', '') === heroId) {
        return true;
      }
    }
  
    return false;
  };

  const handleCloseHeroPage = () => {
    let heroesInfo = document.getElementsByClassName('heroesInfo')[0];
    heroesInfo.style.opacity = "0";
    heroesInfo.style.visibility = "hidden";
    heroesInfo.style.transtion = ".3s";

    setTimeout( function(){heroesInfo.style.display = "none"}, 300);
    setShowHeroInfo(false);
  };

  return (
    <main>
      <header className="header">
        <div className="container logo-wrapper">
          <button className="logo">
            <img src={logo} alt="Marvel Search heroes" />
          </button>
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
          {!loading && displayedHeroes.length === 0 && searchTerm && (
            <div className="empty">
              <h2>Nenhum Herói foi encontrado</h2>
            </div>
          )}

          <div className="listingAndOrdenation">
            <div className="listingAndOrdenationResultCount">
              <span>Encontramos {totalCharactersCount} heróis</span>
            </div>

            <div className="listingAndOrdenationFilters">
              <div className="listingAndOrdenationFilterName">
                <span><img src={heroIcon} alt="Ícone de herói"/>Ordenar por nome - {isToggled ? 'Z/A' : 'A/Z'}</span>
                <button className={isToggled ? 'toggleButtonON' : 'toggleButtonOFF'} onClick={handleToggle}>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="75px" height="41px" viewBox="0 0 75 41" version="1.1">
                    <title>Group 2</title><defs><circle id="path-1" cx="55.5" cy="19.5" r="10.5"/><filter x="-64.3%" y="-50.0%" width="228.6%" height="228.6%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="3" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.881029212   0 0 0 0 0   0 0 0 0 0  0 0 0 0.603747815 0" type="matrix" in="shadowBlurOuter1"/></filter></defs><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="Guide" transform="translate(-80.000000, -1126.000000)"><g id="Group-2" transform="translate(80.000000, 1126.000000)"><rect id="Rectangle" fill="#E4E5E9" x="0" y="0" width="75" height="39" rx="19.5"/><g id="Oval"><use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1"/><use fill="#FF0000" fillRule="evenodd" xlinkHref="#path-1"/></g></g></g></g>
                  </svg>
                </button>
              </div>

              <button className="showOnlyFavorites" onClick={handleShowOnlyFavorites}>
                <img src={heart} alt="símbolo coração" />{showOnlyFavorites ? 'Mostrar Todos' : 'Somente Favoritos'}
              </button>
            </div>
          </div>
          
            {!loading && !showOnlyFavorites && (
              <div className="heroesInfo" style={{ display: showHeroInfo ? "block" : "none" }}>
                <div className="container logo-wrapper">
                  <button className="logo" onClick={handleCloseHeroPage}>
                    <img src={logo} alt="Marvel Search heroes" />
                  </button>

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
                </div>

                <div className="heroInfoPage">
                  <div className="heroInfoPageHeader container">
                    {error ? (
                      <p>Error: {error}</p>
                    ) : (
                      heroInfo && (
                        <>
                        <div className="heroInfosWrapper">
                          <div className="heroInfos">
                            <div className="heroTitleWrapper">
                              <h2 className="heroTitle">{heroInfo.name}</h2>
                              <div className={`heroInfoPageFavoriteICon ${handleHeroPageFavorited(heroInfo.id) ? 'favorited' : ''}`}>
                                <button onClick={(e) => addToFavorites(`heroid${heroInfo.id}`, e)}></button>
                              </div>
                            </div>

                            <div className="heroComicsMoviesWrapper">
                              <span className="heroDescription">{heroInfo.description}</span>
                              
                              <div className="comicsCountSection">
                                <div className="comics">
                                  <div><b>Quadrinhos</b></div>
                                  <div>
                                    <img src={quadrinhos} alt="comics"/>
                                    <span>{heroComicsTotal}</span>
                                  </div>
                                </div>

                                <div className="movies">
                                  <div><b>Filmes</b></div>
                                  <div>
                                    <img src={filmes} alt="comics"/>
                                    <span>0</span>
                                  </div>
                                </div>
                              </div>

                              <div className="ratingWrapper">
                                <span className="rating">
                                  <b>Rating:</b>
                                  <img src={review} alt="5 Estrelas"/>
                                </span>
                              </div>

                              <div className="latestComicDate">
                                <p><b>Último quadrinho: </b> {heroComics && heroComics[0] && heroComics[0].dates && heroComics[0].dates[0] && handleDate(heroComics[0].dates[0].date)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="heroImage">
                            <img 
                              src={heroInfo && heroInfo.thumbnail ? 
                                `${heroInfo.thumbnail.path}.${heroInfo.thumbnail.extension}` : 
                                'https://via.placeholder.com/400'} 
                              alt={heroInfo ? heroInfo.name : 'Placeholder image'} 
                            />
                          </div>
                        </div>

                        <div className="latestReleases">
                          <h2>Últimos lançamentos</h2>

                          <div className="latestReleasesList">
                            {heroComics.map((heroComic) => (
                              <div className="latestReleasesItem" data-release-date={handleDate(heroComic.dates[0].date)} >
                                <img src={heroComic.thumbnail.path !== '' ? heroComic.thumbnail.path + '/portrait_fantastic.' + heroComic.thumbnail.extension : 'https://via.placeholder.com/400'} alt={heroComic.title} />
                                
                                <h3>{heroComic.title}</h3>
                              </div>
                            ))}
                          </div>
                        </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

          <div className="heroes">
            {displayedHeroes.map((hero) => (
              <HeroCard hero={hero} key={hero.id} showCharacterInfo={showCharacterInfo} />
            ))}
          </div>

          {loading && <div className="loadContainer"><div className="load"></div></div>}
        </div>

        {!loading && !showOnlyFavorites && (
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