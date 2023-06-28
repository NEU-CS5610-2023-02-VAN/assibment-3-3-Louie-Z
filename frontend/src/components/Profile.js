import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header";
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, { 
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setName(response.data.username || ''); // set initial username
        setEmail(response.data.email || ''); // set initial email
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/comments?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (user) {
      fetchComments();
    }
  }, [user]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/me`, { username: name, email }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <Header/>
      <h2 className="profile-heading">Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <button type="submit">Update profile</button>
      </form>
      {comments.length > 0 ? (
        <div>
          <h3>Comments</h3>
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <p className="comment-user">{comment.username}</p>
                <p className="comment-content">{comment.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-comments">No comments found.</p>
      )}
    </div>
  );
};

export default Profile;
