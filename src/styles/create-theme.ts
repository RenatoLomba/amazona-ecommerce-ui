import { createTheme } from '@material-ui/core/styles';

export const createDefaultTheme = (darkMode: boolean) => {
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontweight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontweight: 400,
        margin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  return theme;
};
