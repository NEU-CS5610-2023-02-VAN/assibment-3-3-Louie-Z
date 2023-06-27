import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthHandler from './components/AuthHandler';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Profile from './components/Profile'; // Import Profile component
import AuthDebugger from './components/AuthDebugger'; // Import AuthDebugger component
import { AuthTokenProvider } from './AuthTokenContext';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/verify-user" element={<AuthHandler />} />
        <Route path="/profile" element={<Profile />} /> {/* Add route for Profile component */}
        <Route path="/auth-debugger" element={<AuthDebugger />} /> // Add route for AuthDebugger component
      </Routes>
    </Router>
  );
};

export default App;
