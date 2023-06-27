import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import AuthHandler from './components/AuthHandler';  // Import AuthHandler component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies/:id" element={<MovieDetails/>} />
        <Route path="/verify-user" element={<AuthHandler/>} /> {/* Add new route */}
      </Routes>
    </Router>
  ); 
}

export default App;
