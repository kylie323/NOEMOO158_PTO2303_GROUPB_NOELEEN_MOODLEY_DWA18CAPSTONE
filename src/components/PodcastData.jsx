import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import './style.css';
import { genreMap, formatDate } from './PodcastAssets';
import Slider from 'react-slick';
import Favorites from './Favorites'; 
import { applyFilters } from './Filter'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactAudioPlayer from 'react-audio-player';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';

const sharePodcast = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Check out this podcast!',
      url: window.location.href
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing:', error));
  } else {
    console.log('Web Share API not supported');
  }
};

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

function PodcastData({token}) {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch podcasts');
        }
        const data = await response.json();
        setPodcasts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };

    fetchPodcasts();
  }, []);

  
   useEffect(() => {
    const fetchShowDetails = async (showId) => {
      try {
        setLoading(true);
        const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch show details');
        }
        const showData = await response.json();
    
        const episodeDescription = showData.seasons.map(season => season.episodes.map(episode => ({
          ...episode,
          description: episode.description 
        })));
        setSeasonEpisodes(episodeDescription);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching show details:', error);
        setLoading(false);
      }
    };

    if (selectedPodcast) {
      fetchShowDetails(selectedPodcast.id);
    }
  }, [selectedPodcast]);
   

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const seasonsArray = Array.from({ length: selectedPodcast?.seasons || 0 }, (_, index) => index + 1);

  const openModal = (episode) => {
    setCurrentEpisode(episode);
    setModalOpen(true);
  };

  const closeModal = () => {
    const confirmClose = window.confirm('Are you sure you want to close the audio?');
    if (confirmClose) {
      setModalOpen(false);
    }
  };
  

  const toggleFavorite = (podcast) => {
    favorites.includes(podcast) 
      ? setFavorites(favorites.filter((fav) => fav !== podcast)) 
      : setFavorites([...favorites, podcast]);
  };

  const filteredPodcasts = applyFilters(podcasts, filterTitle, filterGenre, sortOption, showFavoritesOnly, favorites);

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
      {loading && <CircularProgress />}
      {!filterTitle && !filterGenre && !showFavoritesOnly && (
        <Slider className="podcast-carousel" {...settings}>
          {shuffledPodcasts.map((podcast, index) => (
            <div key={index}>
              <img
                src={podcast.image}
                alt={podcast.title}
                onClick={() => setSelectedPodcast(podcast)}
              />
              <p>{podcast.title}</p>
            </div>
          ))}
        </Slider>
      )}
      
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

      <label className='favorite-filter'>
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
          disabled={!token}
        />
        Show Favorites Only
      </label>

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
                onClick={() => setSelectedPodcast(podcast)}
              />
              <h3>{podcast.title}</h3>
              <p>Last Updated: {formatDate(podcast.updated)}</p>
              <p>Seasons: {podcast.seasons}</p>
              <p>Genres: {podcast.genres.map((genreId) => genreMap[genreId]).join(', ')}</p>
              <button disabled={!token} className='favorite-button' onClick={() => toggleFavorite(podcast)}>
                {favorites.includes(podcast) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <IconButton onClick={sharePodcast} aria-label="Share podcast">
                <ShareIcon />
              </IconButton>
            </StyledGridItem>
          </Grid>
        ))}
      </Grid>

      {token && selectedPodcast && (
        <div className="podcast-details-container">
          <div className="podcast-details">
            <h2>{selectedPodcast.title}</h2>
            <img src={selectedPodcast.image} alt={selectedPodcast.title} />
            <p>Last Updated: {formatDate(selectedPodcast.updated)}</p>
            <p>Genres: {selectedPodcast.genres.map(genreId => genreMap[genreId]).join(', ')}</p>
            <p>{selectedPodcast.description}</p>
            <button className='close-button' onClick={() => setSelectedPodcast(null)}>Back</button>

            <div className="season-dropdown">
              <select className="season-dropdown-select" onChange={handleSeasonChange}>
                <option value="">Select a Season</option>
                {seasonsArray.map((season, index) => (
                  <option key={index} value={season}>
                    Season {season} ({seasonEpisodes[season - 1]?.length || 0} episodes)
                  </option>
                ))}
              </select>
            </div>

            {selectedSeason && seasonEpisodes[selectedSeason - 1]?.length > 0 && (
              <div className="season-episodes">
                {seasonEpisodes[selectedSeason - 1].map((episode, index) => (
                  <div key={index} className="season-episode-item">
                    {`${index + 1}. ${episode.title}`}
                    <p>{episode.description}</p>
                    <button onClick={() => openModal(episode)}>Play Episode</button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
{modalOpen && (
              <div className="modal-content">
                <ReactAudioPlayer className="audio-player" src={currentEpisode.file} controls={true} />
                <CloseIcon className="close-modal" onClick={closeModal} />
              </div>
          )}
      {showFavoritesOnly && <Favorites favorites={favorites} />}
    </div>
    
  );
}

export default PodcastData;



