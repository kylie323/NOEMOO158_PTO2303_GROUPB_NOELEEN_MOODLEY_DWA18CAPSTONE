import React, { useState } from 'react';
import Header from '../structure/Header';
import { useNavigate } from 'react-router-dom';
import PodcastData from '../components/PodcastData';

function Landing({ token }) {
  const navigate = useNavigate();

  const handleLogout = () => {
      sessionStorage.removeItem('token');
      navigate('/');
  };

  return (
    <div>
      <Header token={token} handleLogout={handleLogout} />
      <img className='hero-image' src='/Hero.png' alt='Hero' />
      <PodcastData  token={token}/> 
      
    </div>
  );
}

export default Landing;
