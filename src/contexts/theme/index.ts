import { createContext } from 'react';

type ThemeContextData = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext({} as ThemeContextData);
