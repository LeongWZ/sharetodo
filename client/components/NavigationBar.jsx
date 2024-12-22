import { Link } from '@tanstack/react-router';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import useToken from '../hooks/useToken';
import { isAuthenticated } from '../util/auth';

const NavigationBar = () => {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken, removeToken] = useToken();

  const handleLogOut = () => {
    removeToken();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Box>
        <Box>
          {isAuthenticated(token) ? (
            <Button color="inherit" onClick={handleLogOut} component={Link} to="/">
                Log Out
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Log In
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
