import React, { useState, useEffect } from 'react';
import './style.css';
import { genreMap, formatDate } from './PodcastAssets';
import Audio from './Audio';

function PodcastDetails({ selectedPodcast, closePodcastDetails }) {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);

  useEffect(() => {
    fetchShowDetails(selectedPodcast.id);
  }, [selectedPodcast]);

  const fetchShowDetails = async (showId) => {
    try {
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
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const seasonsArray = Array.from({ length: selectedPodcast.seasons }, (_, index) => index + 1);

  return (
    <div className="podcast-details-container">
      <div className="podcast-details">
        <h2>{selectedPodcast.title}</h2>
        <img src={selectedPodcast.image} alt={selectedPodcast.title} />
        <p>Last Updated: {formatDate(selectedPodcast.updated)}</p>
        <p>Genres: {selectedPodcast.genres.map(genreId => genreMap[genreId]).join(', ')}</p>
        <p>{selectedPodcast.description}</p>
        <button className='close-button' onClick={closePodcastDetails}>Back</button>

        <div className="season-dropdown">
          <select className="season-dropdown-select" onChange={handleSeasonChange}>
            <option value="">Select a Season</option>
            {seasonsArray.map((season, index) => (
              <option key={index} value={season}>
                Season {season} ({seasonEpisodes[season - 1]?.length} episodes)
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
                <Audio audioUrl={episode.file} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PodcastDetails;
