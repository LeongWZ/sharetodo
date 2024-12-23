/* eslint-disable react/prop-types */
import { Box, Typography, IconButton, Checkbox, Tooltip, Divider, List, ListItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckableItem from './CheckableItem';
import PriorityTag from './PriorityTag';

const TodoItem = ({ todo, handleEditTodo, handleDeleteTodo, editTodoMutationFn }) => {
  
  const handleCheckCheckableItem = (updatedItem) => editTodoMutationFn({
    ...todo,
    checkable_items: todo.checkable_items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    ),
  });

  const handleCheckTodo = (isChecked) => editTodoMutationFn({
    ...todo,
    is_done: isChecked
  });
  
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6">{todo.title}</Typography>
        <Tooltip title={todo.is_done ? "Done" : "Not done"}>
          <Checkbox
            checked={todo.is_done}
            onChange={(e) => handleCheckTodo(e.target.checked)}
            color="success"
          />
        </Tooltip>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <PriorityTag priority={todo.priority} />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Description:</strong> {todo.description}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Notes:</strong> {todo.notes}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Due Date:</strong> {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "None"}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Updated At:</strong> {new Date(todo.updated_at).toLocaleString()}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Checkable Items:</strong>
      </Typography>
      <List dense>
        {todo.checkable_items.map((item) => (
          <ListItem key={item.id} sx={{ pl: 0 }}>
            <CheckableItem item={item} onCheck={handleCheckCheckableItem} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <IconButton color="primary" onClick={() => handleEditTodo(todo)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteTodo(todo)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TodoItem;
