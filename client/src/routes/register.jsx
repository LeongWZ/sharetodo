import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRegistration } from '../../services/auth/endpoint';
import useToken from '../../hooks/useToken';

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: Register,
});

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const registrationMutation = useRegistration();

  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  // eslint-disable-next-line no-unused-vars
  const [token, setToken, removeToken] = useToken();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    try {
      const token = await registrationMutation.mutateAsync({
        username,
        email,
        password1,
        password2,
      });
      setToken(token);
      navigate({ to: redirect ?? '/' });
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.password1?.[0] || 'Registration failed';
        setError(errorMessage);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password1"
            label="Password"
            type="password"
            id="password1"
            autoComplete="new-password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirm Password"
            type="password"
            id="password2"
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
