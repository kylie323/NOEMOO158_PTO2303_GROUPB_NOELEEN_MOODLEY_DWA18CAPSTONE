
export function applyFilters(podcasts, filterTitle, filterGenre, sortOption, showFavoritesOnly, favorites) {
    let filteredPodcasts = podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
        (filterGenre === '' || podcast.genres.includes(parseInt(filterGenre)))
    );
  
    if (showFavoritesOnly) {
      filteredPodcasts = filteredPodcasts.filter((podcast) => favorites.includes(podcast));
    }
  
    if (sortOption === 'titleAZ') {
      filteredPodcasts = filteredPodcasts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'titleZA') {
      filteredPodcasts = filteredPodcasts.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === 'dateAsc') {
      filteredPodcasts = filteredPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    } else if (sortOption === 'dateDesc') {
      filteredPodcasts = filteredPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
  
    return filteredPodcasts;
  }
  