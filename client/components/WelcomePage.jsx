import { Link as RouterLink } from '@tanstack/react-router';
import { Container, Box, Typography, Button, Stack } from '@mui/material';

const WelcomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to ShareTodo!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Organize your tasks and collaborate with your team effortlessly.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sign up now to start managing your projects and tasks in one place.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/login"
            sx={{ mt: 3 }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/register"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default WelcomePage;