import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Header from './Header';
import Footer from './Footer';
import MovieCard from './MovieCard';

function Home() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <div>
      <Header />
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
          </button>
        </div>
      ) : (
        <button onClick={loginWithRedirect}>Log in</button>
      )}
      <MovieCard />
      <Footer />
    </div>
  );
}

export default Home;