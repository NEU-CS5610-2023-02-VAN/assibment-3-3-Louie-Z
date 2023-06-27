import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

import Profile from './components/Profile';
import Home from './components/Home';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';

const root = ReactDOM.createRoot(document.getElementById('root'));

const requestedScopes = [
  "profile",
  "email",
  "read:todoitem",
  "read:user",
  "edit:todoitem",
  "edit:user",
  "delete:todoitem",
  "delete:user",
  "write:user",
  "write:todoitem",
];


root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      redirectUri={process.env.REACT_APP_AUTH0_REDIRECT_URI}
> 
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
