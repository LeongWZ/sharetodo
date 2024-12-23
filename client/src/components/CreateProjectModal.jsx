/* eslint-disable react/prop-types */
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const CreateProjectModal = ({ open, onClose, newProjectTitle, setNewProjectTitle, handleCreateProject, createProject }) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create New Project
        </Typography>
        <TextField
          fullWidth
          label="Project Title"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          margin="normal"
          required
        />
        {createProject.isError && (
          <Typography color="error">
            {createProject.error.message}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateProject}
          fullWidth
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;