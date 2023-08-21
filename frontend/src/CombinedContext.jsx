import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

const CombinedContext = createContext();

export const CombinedProvider = ({ children }) => {
  const { userRole } = useAuth();
  const { user } = useUser();

  return (
    <CombinedContext.Provider value={{ userRole, user }}>
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombined = () => useContext(CombinedContext);
