import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and userId from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Navigate to login page
    navigate('/login');
  };

  return (
   
      <div className="header-content">
        <h1 className="header-title">Chatly</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

  );
}

export default Header;
