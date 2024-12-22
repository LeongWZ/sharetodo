/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { RoleEnum } from '@/util/constants';
import { isUserAdmin } from '@/util/membership';

const MembershipModal = ({ open, onClose, members, user, handleAddMember, handleEditMember, handleDeleteMember }) => {
  const isAdmin = isUserAdmin(members, user);
  const [newMember, setNewMember] = React.useState('');
  const [newRole, setNewRole] = React.useState(RoleEnum.MEMBER);
  const [error, setError] = React.useState('');

  const onAddMember = async () => {
    try {
      await handleAddMember({ username: newMember, role: newRole});
      setNewMember('');
      setNewRole(RoleEnum.MEMBER);
      setError('');
    } catch (error) {
      console.error('Failed to add member:', error);
      setError(error.message)
    }
  };

  const onEditRole = async (membershipId, username, role) => {
    try {
      await handleEditMember({
        id: membershipId,
        username: username,
        role: role,
      });
      setError('');
    } catch (error) {
      console.error('Failed to edit role:', error);
      setError(error.message)
    }
  };

  const onDeleteMember = async (membershipId) => {
    try {
      await handleDeleteMember(membershipId);
      setError('');
    } catch (error) {
      console.error('Failed to delete member:', error);
      setError(error.message)
    }
  };

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
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Project Memberships</Typography>
        {members.map((member) => (
          <Box key={member.id} sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', gap: 1 }}>
            <Typography>{member.user}</Typography>

            {isAdmin && member.user !== user.username && (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Select
                    value={member.role}
                    onChange={(e) => onEditRole(member.id, member.user, e.target.value)}
                    sx={{ minWidth: 110 }}
                >
                    <MenuItem value={RoleEnum.MEMBER}>Member</MenuItem>
                    <MenuItem value={RoleEnum.ADMIN}>Admin</MenuItem>
                </Select>
                <IconButton onClick={() => onDeleteMember(member.id)}>
                    <DeleteIcon />
                </IconButton>
            </Box>
            )}
          </Box>
        ))}
        {isAdmin && (
          <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', gap: 1 }}>
            <TextField
              label="Username"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              required
              />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  sx={{ minWidth: 110 }}
              >
                  <MenuItem value={RoleEnum.MEMBER}>Member</MenuItem>
                  <MenuItem value={RoleEnum.ADMIN}>Admin</MenuItem>
              </Select>
              <IconButton onClick={onAddMember}>
                  <AddIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default MembershipModal;