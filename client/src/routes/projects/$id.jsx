import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { useProject, useProjectTodos, useCreateProjectTodos } from '../../../services/projects/endpoint';
import { useDeleteTodo, useEditTodo } from '../../../services/todos/endpoint';
import { Container, Box, Typography, List, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useToken from '../../../hooks/useToken';
import { useQueryClient } from '@tanstack/react-query';
import TodoItem from '../../../components/TodoItem';
import TodoFormModal from '../../../components/TodoFormModal';

export const Route = createFileRoute('/projects/$id')({
  component: Project,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  }
});

function Project() {
  const { id } = Route.useParams();
  const [token] = useToken();
  const queryClient = useQueryClient();
  const { data: project, isLoading: projectLoading } = useProject(id, token);
  const { data: todos, isLoading: todosLoading } = useProjectTodos(id, token);
  const createTodoMutation = useCreateProjectTodos(id, token, queryClient);
  const deleteTodoMutation = useDeleteTodo(id, token, queryClient);
  const editTodoMutation = useEditTodo(id, token, queryClient);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    notes: '',
    due_date: '',
    project: id,
    checkable_items: [],
  });
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditTodoId(null);
    setNewTodo({
      title: '',
      description: '',
      notes: '',
      due_date: '',
      project: id,
      checkable_items: [],
    });
    setError('');
  };

  const handleCreateTodo = async () => {
    if (
      newTodo.title.trim() &&
      newTodo.due_date.trim() &&
      newTodo.checkable_items.every(item => item.title.trim())
    ) {
      try {
        if (isEditing) {
          await editTodoMutation.mutateAsync({ ...newTodo, id: editTodoId });
        } else {
          await createTodoMutation.mutateAsync(newTodo);
        }
        handleClose();
      } catch (error) {
        setError('Failed to save todo. Please check the input fields.');
        console.error(error);
      }
    } else {
      setError('Title, due date, and checkable items are required.');
    }
  };

  const handleDeleteTodo = async (todo) => {
    try {
      await deleteTodoMutation.mutateAsync(todo);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEditTodo = (todo) => {
    setNewTodo({
      title: todo.title,
      description: todo.description,
      notes: todo.notes,
      due_date: todo.due_date,
      project: todo.project,
      checkable_items: todo.checkable_items,
    });
    setEditTodoId(todo.id);
    setIsEditing(true);
    handleOpen();
  };

  const handleCheckTodo = async (todo, isChecked) => {
    try {
      await editTodoMutation.mutateAsync({ ...todo, is_done: isChecked });
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCheckCheckableItem = async (todo, updatedItem) => {
    try {
      await editTodoMutation.mutateAsync({
        ...todo,
        checkable_items: todo.checkable_items.map(item => item.id === updatedItem.id ? updatedItem : item),
      });
    } catch (error) {
      console.error('Failed to update checkable item:', error);
    }
  };

  if (projectLoading || todosLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Created at: {new Date(project.created_at).toLocaleString()}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Todos
          </Typography>
          <List>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                handleEditTodo={handleEditTodo}
                handleDeleteTodo={handleDeleteTodo}
                handleCheckCheckableItem={handleCheckCheckableItem}
                handleCheckTodo={handleCheckTodo}
              />
            ))}
          </List>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpen}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
          <TodoFormModal
            open={open}
            handleClose={handleClose}
            handleCreateTodo={handleCreateTodo}
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            error={error}
            isEditing={isEditing}
          />
        </Box>
      </Box>
    </Container>
  );
}
