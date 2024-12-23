import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useForgetPassword } from '../services/auth/endpoint'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forget-password')({
  component: ForgetPassword,
})

function ForgetPassword() {
  const [email, setEmail] = useState('')
  const forgetPasswordMutation = useForgetPassword()

  const handleSubmit = (e) => {
    e.preventDefault()
    forgetPasswordMutation.mutate({ email })
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Forget Password
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter your email address to receive a password reset link.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: '100%' }}
        >
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          {forgetPasswordMutation.isPending && (
            <Box display="flex" justifyContent="center" mb={2}>
              <CircularProgress />
            </Box>
          )}
          {forgetPasswordMutation.isSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Reset link sent successfully!
            </Alert>
          )}
          {forgetPasswordMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to send reset link. Please try again.
            </Alert>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Reset Link
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default ForgetPassword
