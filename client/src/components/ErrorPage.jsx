import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "@tanstack/react-router";

function ErrorPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
      <Typography variant="h4" sx={{ mt: 2 }}>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{ mt: 3 }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
}

export default ErrorPage;