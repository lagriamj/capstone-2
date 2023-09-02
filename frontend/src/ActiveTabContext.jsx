import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ActiveTabContext = createContext();

export const useActiveTab = () => {
  return useContext(ActiveTabContext);
};

export const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(null);

  const setActive = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActive }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

ActiveTabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
