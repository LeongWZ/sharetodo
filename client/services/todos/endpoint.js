// eslint-disable-next-line no-unused-vars
import { QueryClient, useMutation } from "@tanstack/react-query";

const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;

/**
 * 
 * @param {number} projectId
 * @param {string} token 
 * @param {QueryClient} queryClient 
 * @returns 
 */
export function useDeleteTodo(projectId, token, queryClient) {
    const deleteTodo = async (todo) => {
        const response = await fetch(`${serverEndpoint}/todos/${todo.id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        
        if (response.status !== 204) {
            throw new Error("Failed to delete todo");
        }

        return;
    }

    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "todos"] });
        }
    });
}

export function useEditTodo(projectId, token, queryClient) {
    const editTodo = async (todo) => {
        const response = await fetch(`${serverEndpoint}/todos/${todo.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(todo)
        });

        if (!response.ok) {
            throw new Error("Failed to edit todo");
        }

        return response.json();
    }

    return useMutation({
        mutationFn: editTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "todos"] });
        }
    });
}

