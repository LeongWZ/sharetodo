/* eslint-disable react/prop-types */
import { Box, Typography, IconButton, Checkbox, Tooltip } from '@mui/material';
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
        <Typography variant="body2" color="textSecondary">
          Description: {todo.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Notes: {todo.notes}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Due Date: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "None"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Updated At: {new Date(todo.updated_at).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Checkable Items:
        </Typography>
        <Box>
          {todo.checkable_items.map((item) => (
            <CheckableItem key={item.id} item={item} onCheck={handleCheckCheckableItem} />
          ))}
        </Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
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