import React, { createContext, useState } from "react";

export const UserContext = createContext({
  user: null, 
  setUser: () => {},  
  userToken: null,
  setUserToken: () => {},
  userId: null,
  setUserId: () => {},
});


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser, 
        userToken,
        setUserToken,
        userId,
        setUserId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};