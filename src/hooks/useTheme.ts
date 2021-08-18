import { useContext } from 'react';
import { ThemeContext } from '../contexts/theme';

export const useTheme = () => {
  return useContext(ThemeContext);
};
