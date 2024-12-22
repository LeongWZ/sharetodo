/* eslint-disable react/prop-types */
import { Box, Typography, IconButton, Checkbox, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckableItem from './CheckableItem';

const TodoItem = ({ todo, handleEditTodo, handleDeleteTodo, handleCheckCheckableItem, handleCheckTodo }) => {
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
              onChange={(e) => handleCheckTodo(todo, e.target.checked)}
              color="success"
              />
          </Tooltip>
        </Box>

        <Typography variant="body2" color="textSecondary">
          Description: {todo.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Notes: {todo.notes}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Due Date: {new Date(todo.due_date).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Updated At: {new Date(todo.updated_at).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Priority: {todo.priority}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Checkable Items:
        </Typography>
        <Box>
          {todo.checkable_items.map((item) => (
            <CheckableItem key={item.id} item={item} onCheck={(updatedItem) => handleCheckCheckableItem(todo, updatedItem)} />
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