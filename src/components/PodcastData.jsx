import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import './style.css';
import { genreMap, formatDate } from './PodcastAssets';
import PodcastDetails from './PodcastDetails';
import Slider from 'react-slick';
import Favorites from './Favorites'; 
import { applyFilters } from './Filter'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function PodcastData() {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch podcasts');
        }
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };

    fetchPodcasts();
  }, []);

  const openPodcastDetails = (podcast) => {
    setSelectedPodcast(podcast);
  };

  const closePodcastDetails = () => {
    setSelectedPodcast(null);
  };

  const toggleFavorite = (podcast) => {
    if (favorites.includes(podcast)) {
      setFavorites(favorites.filter((fav) => fav !== podcast));
    } else {
      setFavorites([...favorites, podcast]);
    }
  };

  const filteredPodcasts = applyFilters(
    podcasts,
    filterTitle,
    filterGenre,
    sortOption,
    showFavoritesOnly,
    favorites
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
  };

  const shuffledPodcasts = shuffleArray(podcasts.slice(0, 8));

  return (
    <div className="podcast-container">
      <input
        className="search-filter"
        type="text"
        placeholder="Filter by title"
        value={filterTitle}
        onChange={(e) => setFilterTitle(e.target.value)}
      />
      <select
        className="genre-filter"
        value={filterGenre}
        onChange={(e) => setFilterGenre(e.target.value)}
      >
        <option value="">All Genres</option>
        {Object.entries(genreMap).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>


      <label  className='favorite-filter'>
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />
        Show Favorites Only
      </label>

      {!filterTitle && !filterGenre && !showFavoritesOnly && (
        <Slider className="podcast-carousel" {...settings}>
          {shuffledPodcasts.map((podcast, index) => (
            <div key={index}>
              <img
                src={podcast.image}
                alt={podcast.title}
                onClick={() => openPodcastDetails(podcast)}
              />
              <p>{podcast.title}</p>
              <button className='favorite-button' onClick={() => toggleFavorite(podcast)}>
                {favorites.includes(podcast) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          ))}
        </Slider>
      )}

      <select
        className="sort-filter"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">Sort by...</option>
        <option value="titleAZ">Title A-Z</option>
        <option value="titleZA">Title Z-A</option>
        <option value="dateAsc">Date Updated (Ascending)</option>
        <option value="dateDesc">Date Updated (Descending)</option>
      </select>

      <Grid container spacing={2}>
        {filteredPodcasts.map((podcast, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <StyledGridItem>
              <img
                className="preview-image"
                src={podcast.image}
                alt={podcast.title}
                onClick={() => openPodcastDetails(podcast)}
              />
              <h3>{podcast.title}</h3>
              <p>Last Updated: {formatDate(podcast.updated)}</p>
              <p>Seasons: {podcast.seasons}</p>
              <p>Genres: {podcast.genres.map((genreId) => genreMap[genreId]).join(', ')}</p>
              <button className='favorite-button' onClick={() => toggleFavorite(podcast)}>
                {favorites.includes(podcast) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </StyledGridItem>
          </Grid>
        ))}
      </Grid>

      {selectedPodcast && (
        <PodcastDetails
          selectedPodcast={selectedPodcast}
          closePodcastDetails={closePodcastDetails}
        />
      )}

      {showFavoritesOnly && (
        <Favorites favorites={favorites} />
      )}

    </div>
  );
}

export default PodcastData;
