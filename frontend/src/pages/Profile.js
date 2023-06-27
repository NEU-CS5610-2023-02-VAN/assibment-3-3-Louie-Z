import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div>
      <h1>Profile Page</h1>
      {isAuthenticated ? (
        <React.Fragment>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <img src={user.picture} alt="Profile" />
        </React.Fragment>
      ) : (
        <p>Please login to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
