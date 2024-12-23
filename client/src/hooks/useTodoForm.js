import { useState } from 'react';
import { useCreateProjectTodos } from '../services/projects/endpoint';
import { useEditTodo } from '../services/todos/endpoint';
import { useQueryClient } from '@tanstack/react-query';
import { PriorityEnum } from '../util/constants';

export default function useTodoForm(projectId, token) {
  const queryClient = useQueryClient();
  const createTodoMutation = useCreateProjectTodos(projectId, token, queryClient);
  const editTodoMutation = useEditTodo(projectId, token, queryClient);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    notes: '',
    due_date: null,
    priority: PriorityEnum.MEDIUM,
    project: projectId,
    checkable_items: [],
  });
  const [error, setError] = useState('');

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setIsEditing(false);
    setEditTodoId(null);
    setNewTodo({
      title: '',
      description: '',
      notes: '',
      due_date: null,
      priority: PriorityEnum.MEDIUM,
      project: projectId,
      checkable_items: [],
    });
    setError('');
  };

  const submit = async () => {
    if (
      newTodo.title.trim() &&
      newTodo.checkable_items.every((item) => item.title.trim())
    ) {
      try {
        if (isEditing) {
          await editTodoMutation.mutateAsync({ ...newTodo, id: editTodoId });
        } else {
          await createTodoMutation.mutateAsync(newTodo);
        }
        close();
      } catch (error) {
        setError('Failed to save todo. Please check the input fields.');
        console.error(error);
      }
    } else {
      setError('Title, due date, and checkable items are required.');
    }
  };

  const handleEditTodo = (todo) => {
    setNewTodo({
      title: todo.title,
      description: todo.description,
      notes: todo.notes,
      due_date: todo.due_date,
      priority: todo.priority,
      project: todo.project,
      checkable_items: todo.checkable_items,
    });
    setEditTodoId(todo.id);
    setIsEditing(true);
    open();
  };

  return {
    isOpen,
    open,
    close,
    isEditing,
    newTodo,
    setNewTodo,
    error,
    submit,
    handleEditTodo,
  };
};
