import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { TextField, Button, Container, Typography, Box } from '@mui/material'
import { useLogin } from '../../services/auth/endpoint'
import useToken from '../../hooks/useToken'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: LogIn,
})

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const navigate = useNavigate()
  const { redirect } = Route.useSearch()

  // eslint-disable-next-line no-unused-vars
  const [token, setToken, removeToken] = useToken()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const token = await loginMutation.mutateAsync({ email, password });
      setToken(token);
      navigate({ to: redirect ?? '/' });
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

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
          Log In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
