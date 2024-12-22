/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const EditProjectModal = ({ open, onClose, project, handleEditProject }) => {
  const [newTitle, setNewTitle] = React.useState(project.title);

  const onSave = () => {
    handleEditProject({ ...project, title: newTitle });
    onClose();
  };

  const onCloseAndResetNewTitle = () => {
    setNewTitle(project.title);
    onClose();
  }

  return (
    <Modal open={open} onClose={onCloseAndResetNewTitle}>
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
        <Typography variant="h6">Edit Project</Typography>
        <TextField
          label="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditProjectModal;
