import React, { createContext, useContext, useState } from 'react';

const AuthTokenContext = createContext();

export const AuthTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const setAuthToken = (token) => {
    setAccessToken(token);
  };

  return (
    <AuthTokenContext.Provider value={{ accessToken, setAuthToken }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = () => {
  return useContext(AuthTokenContext);
};
