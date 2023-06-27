import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleSearch = (e) => {
    e.preventDefault();
    searchForMovie(searchQuery);
  };

  const searchForMovie = async (query) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${query}`
      );
      const data = await response.json();
      const firstResult = data.results[0];
      if (firstResult) {
        const movieId = firstResult.id;
        navigate(`/movies/${movieId}`);
      } else {
        console.log(`No results found for "${query}"`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleHomeButtonClick = () => {
    navigate('/');
  };

  const handleProfileButtonClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      window.alert('Please log in to view the profile');
    }
  };

  const handleAuthDebuggerButtonClick = () => {
    if (isAuthenticated) {
      navigate('/authdebugger');
    } else {
      window.alert('Please log in to view the Auth Debugger');
    }
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo-container">
          <button className="logo-button" onClick={handleHomeButtonClick}>
            <img className="logo" src={`${process.env.PUBLIC_URL}/popcorn.ico`} alt="Popcorn icon" />
            <h1 className="app-name">MyMovies</h1>
          </button>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {isAuthenticated && (
          <div>
            <button className="profile-button" onClick={handleProfileButtonClick}>
              Profile
            </button>
            <button className="debugger-button" onClick={handleAuthDebuggerButtonClick}>
              Auth Debugger
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
