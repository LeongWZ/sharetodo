/* eslint-disable react/prop-types */
import { Modal, Box, Typography, Button } from '@mui/material';

function DeleteTodoModal({ open, handleClose, handleDeleteTodo }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "90%",
          maxWidth: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Delete Todo</Typography>
        <Typography>Are you sure you want to delete this todo?</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="error" onClick={handleDeleteTodo}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteTodoModal;