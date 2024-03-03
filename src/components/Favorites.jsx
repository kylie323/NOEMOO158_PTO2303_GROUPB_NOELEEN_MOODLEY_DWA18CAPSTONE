import React from 'react';

function Favorites({ favorites }) {
  return (
    <div>
      {favorites.length > 0 ? (
        favorites.map((fav, index) => (
          <div key={index}>
          </div>
        ))
      ) : (
        <p>No favorite podcasts yet.</p>
      )}
    </div>
  );
}

export default Favorites;
