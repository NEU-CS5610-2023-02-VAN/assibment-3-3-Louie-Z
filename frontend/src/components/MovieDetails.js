import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import './MovieDetails.css';
import Header from "./Header"

function MovieDetails() {
  const { id } = useParams();
  const [selectedMovie, setSelectedMovie] = useState("");
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const API_KEY = process.env.REACT_APP_API_KEY;
  const calendar = require('../images/calendar.png');
  const time = require('../images/time.png');
  const star = require('../images/star.png');
  const genre = require('../images/genre.png');
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: API_KEY
          }
        });
        setSelectedMovie(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMovie();
  }, [id, API_KEY]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      id: comments.length + 1,
      text: commentInput,
    };
    setComments([...comments, newComment]);
    setCommentInput('');
  };

  return (
    <div>
      <Header />
    
    <div className="container-horizontal">
      {selectedMovie && (
        <div className="card-horizontal">
          <img className="poster-horizontal" src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`} alt={selectedMovie.title} />
          <div className="details-horizontal">
            <h3 className="title-horizontal">{selectedMovie.title}</h3>
            <div className="info-horizontal">
              <div className="info-pair">
                <img src={calendar} className="calendar" alt="calendar" />
                <p className="release-date-horizontal">{selectedMovie.release_date && new Date(selectedMovie.release_date).getFullYear()}</p>
              </div>
              <div className="info-pair">
                <img src={genre} className="genre" alt="genre" />
                <p className="genre-horizontal">{selectedMovie.genres.slice(0, 3).map(genre => genre.name).join(", ")}</p>
              </div>
              <div className="info-pair">
                <img src={time} className="time" alt="time" />
                <p className="length-horizontal">{Math.floor(selectedMovie.runtime / 60)}h {selectedMovie.runtime % 60}m</p>
              </div>
              <div className="info-pair">
                <img src={star} className="star" alt="star" />
                <p className="rating-horizontal">{selectedMovie.vote_average.toFixed(1)}</p>
              </div>
            </div>
            <div className="overview-horizontal">
              <p className="overview-title">SYNOPSIS</p>
              <p className="overview-info">{selectedMovie.overview}</p>
            </div>
            {isAuthenticated && (
            <div className="comment-form">
              <h3>Add Comment</h3>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Enter your comment"
                ></textarea>
                <button type="submit">Submit</button>
              </form>
            </div>
            )}
            {isAuthenticated && (
            <div className="comment-list">
              <h3>Comments</h3>
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>)}
          </div>
        </div>
      )}
    </div>
  /</div>
  );

}

export default MovieDetails;
