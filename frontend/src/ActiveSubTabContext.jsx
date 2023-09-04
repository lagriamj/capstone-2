import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ActiveSubTabContext = createContext();

export const useActiveSubTab = () => {
  return useContext(ActiveSubTabContext);
};

export const ActiveSubTabProvider = ({ children }) => {
  const [activeSubTab, setActiveSubTab] = useState(null);

  const setActiveSub = (tab) => {
    setActiveSubTab(tab);
  };

  return (
    <ActiveSubTabContext.Provider value={{ activeSubTab, setActiveSub }}>
      {children}
    </ActiveSubTabContext.Provider>
  );
};

ActiveSubTabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
