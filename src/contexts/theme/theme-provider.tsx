import React, { FC, useEffect, useState } from 'react';
import nookies from 'nookies';
import { ThemeContext } from '.';

export const ThemeContextProvider: FC = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    nookies.set(null, 'DARK_MODE', String(!darkMode));
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const { DARK_MODE } = nookies.get(null);
    if (!DARK_MODE) return;
    setDarkMode(DARK_MODE === 'true');
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
