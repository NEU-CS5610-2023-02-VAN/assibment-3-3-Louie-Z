import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthHandler = () => {
  const { isLoading, error, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const registerUser = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.post("/users", {
            username: user.nickname,
            email: user.email,
          });
          console.log("User created successfully:", response.data);
      
        } catch (error) {
          console.error("Failed to create user:", error.response.data.error);
          
        }
      }
    };

    if (isAuthenticated) {
      registerUser();
      navigate('/'); // redirect to home page
    }
  }, [isAuthenticated, navigate, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return null;
};

export default AuthHandler;
