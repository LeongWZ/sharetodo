import { useMutation } from '@tanstack/react-query';

const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;

export function useDeleteMembership(projectId, token, queryClient) {
    const deleteMembership = async ({ id }) => {
        const response = await fetch(`${serverEndpoint}/memberships/${id}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (response.status !== 204) {
            throw new Error("Failed to delete membership");
        }

        return;
    }

    return useMutation({
        mutationFn: deleteMembership,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
    });
}

export function useEditMembership(projectId, token, queryClient) {
    const editMembership = async ({id, username, role}) => {
        const response = await fetch(`${serverEndpoint}/memberships/${id}/`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                user: username,
                role: role
            })
        });

        if (response.status !== 200) {
            throw new Error("Failed to edit membership");
        }

        return response.json();
    }

    return useMutation({
        mutationFn: editMembership,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId] })
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
    });
}