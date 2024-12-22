/* eslint-disable react/prop-types */
import { Box, Typography, TextField, Button, IconButton, Modal, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const TodoFormModal = ({ open, handleClose, handleCreateTodo, newTodo, setNewTodo, error, isEditing }) => {
  const handleCheckableItemChange = (index, value) => {
    const newCheckableItems = newTodo.checkable_items
      .map((item, i) => i === index ? { ...item, title: value } : item);

    setNewTodo({ ...newTodo, checkable_items: newCheckableItems });
  };

  const handleAddCheckableItem = () => {
    setNewTodo({ ...newTodo, checkable_items: [...newTodo.checkable_items, { title: '', is_checked: false }] });
  };

  const handleRemoveCheckableItem = (index) => {
    const newCheckableItems = newTodo.checkable_items.filter((_, i) => i !== index);
    setNewTodo({ ...newTodo, checkable_items: newCheckableItems });
  };

  const handleCheckCheckableItem = (index, isChecked) => {
    const newCheckableItems = newTodo.checkable_items
      .map((item, i) => i === index ? { ...item, is_checked: isChecked } : item);
      
    setNewTodo({ ...newTodo, checkable_items: newCheckableItems });
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '90%', 
        maxWidth: 500, 
        maxHeight: '90vh', 
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        overflow: 'auto' 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {isEditing ? 'Edit Todo' : 'Add Todo'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          label="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Description (optional)"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          fullWidth
        />
        <TextField
          label="Notes (optional)"
          value={newTodo.notes}
          onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
          fullWidth
        />
        <TextField
          label="Due Date"
          type="date"
          value={newTodo.due_date}
          onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography variant="h6">Checkable Items</Typography>
        {newTodo.checkable_items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label={`Item ${index + 1}`}
              value={item.title}
              onChange={(e) => handleCheckableItemChange(index, e.target.value)}
              fullWidth
              required
            />
            <Checkbox checked={item.is_checked} onChange={(e) => handleCheckCheckableItem(index, e.target.checked)} />
            <IconButton onClick={() => handleRemoveCheckableItem(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddCheckableItem}
        >
          Add Item
        </Button>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleCreateTodo}>
          {isEditing ? 'Save Changes' : 'Add Todo'}
        </Button>
      </Box>
    </Modal>
  );
};

export default TodoFormModal;