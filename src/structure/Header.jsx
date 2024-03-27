import React from 'react';
import './style.css'; 
import { Link } from 'react-router-dom';

function Header({ token, handleLogout }) {
  return (
    <header className="navbar">
      <div className="logo-container">
        <img className="logo" src="./Logo.jpeg" alt="logo-image" />
        <div className="logo-text">ListenUp</div>
      </div>
      {token ? (
        <div className="user-info">
          <button onClick={handleLogout} className='logout-button'>Logout</button>
        </div>
      ) : (
        <div className="login-info">
          <Link to="/login" className="login-link">Login</Link>
        </div>
      )}
    </header>
  );
}

export default Header;

