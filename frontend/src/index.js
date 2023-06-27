import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="mymovie.us.auth0.com"
      clientId="DSiNo0g8havaR3gf70MOsLCA6CiMHWqJ"
      audience="https://api.mymovie"
      scope="openid profile email"
      redirectUri={process.env.REACT_APP_AUTH0_REDIRECT_URI}
>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
