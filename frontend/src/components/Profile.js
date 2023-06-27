import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "./Header"

const Profile = () => {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/me'); // Endpoint to fetch user data from the backend
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/comments'); // Endpoint to fetch user comments from the backend
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (user) {
      fetchComments();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header/>
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
      {comments.length > 0 ? (
        <div>
          <h3>Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.comment}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No comments found.</p>
      )}
    </div>
    </div>
  );
};

export default Profile;
