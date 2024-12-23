import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useResetPassword } from '../services/auth/endpoint';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
  validateSearch: (search) => {
    return {
      uid: search?.uid ?? "",
      token: search?.token ?? "",
    }
  }
})

function ResetPassword() {
  const { uid, token } = Route.useSearch();
  const resetPasswordMutation = useResetPassword();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }
    resetPasswordMutation.mutate({ uid, token, password1, password2 });
  };

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
          Reset Password
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter your new password below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {resetPasswordMutation.isSuccess && <Alert severity="success">Password reset successfully!</Alert>}
          {resetPasswordMutation.isError && <Alert severity="error">{resetPasswordMutation.error.message}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;