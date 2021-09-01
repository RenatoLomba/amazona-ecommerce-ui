import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#fff',
      marginLeft: 10,
    },
  },
  navbarButton: {
    color: '#fff',
    textTransform: 'initial',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    color: '#f04040',
  },
  fullWidth: {
    width: '100%',
  },
});

export { useStyles };
