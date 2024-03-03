import React from 'react';
import Header from '../structure/Header';
import Home from './Home'; 
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
      <PodcastData />
    </div>
  );
}

export default Landing;
