import React from 'react';
import { useDeleteTodo } from '../services/todos/endpoint';
import { useQueryClient } from '@tanstack/react-query';

export default function useDeleteTodoForm(projectId, token) {
    const queryClient = useQueryClient();
    const deleteTodoMutation = useDeleteTodo(projectId, token, queryClient);

    const [isOpen, setIsOpen] = React.useState(false);
    const [todoToDelete, setTodoToDelete] = React.useState(null);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const submit = async () => {
        try {
            await deleteTodoMutation.mutateAsync(todoToDelete);
            close();
        } catch (error) {
            console.error(error);
        };
    }

    return {
        isOpen,
        todoToDelete,
        setTodoToDelete,
        open,
        close,
        submit
    };
}
