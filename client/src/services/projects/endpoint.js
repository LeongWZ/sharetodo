import { useQuery, useMutation } from "@tanstack/react-query";

const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;


export function useProjects(token) {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            if (!token) {
                throw new Error("No token available");
            }
            const response = await fetch(`${serverEndpoint}/projects/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.json();
        },
    });
}

export function useCreateProject(token, queryClient) {

    /**
     * @param {{ title: String }} newProject 
     * @returns 
     */
    const postProject = async (newProject) => {
        const response = await fetch(`${serverEndpoint}/projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(newProject),
        });

        if (!response.ok) {
            throw new Error("Failed to create project");
        }

        return response.json();
    };

    return useMutation({
        mutationFn: postProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useProject(projectId, token) {
    return useQuery({
        queryKey: ["projects", projectId],
        queryFn: async () => {
            if (!token) {
                throw new Error("No token available");
            }
            const response = await fetch(`${serverEndpoint}/projects/${projectId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.json();
        },
    });
}

export function useEditProject(projectId, token, queryClient) {

    /**
     * @param {{ title: String }} project 
     * @returns 
     */
    const putProject = async (project) => {
        const response = await fetch(`${serverEndpoint}/projects/${projectId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(project)
        });

        if (!response.ok) {
            throw new Error("Failed to edit project");
        }

        return response.json();
    }

    return useMutation({
        mutationFn: putProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });
}

export function useDeleteProject(projectId, token, queryClient) {

    /**
     * @param {{ title: String }} project 
     * @returns 
     */
    const deleteProject = async () => {
        const response = await fetch(`${serverEndpoint}/projects/${projectId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            }
        });

        if (response.status !== 204) {
            throw new Error("Failed to delete project");
        }

        return;
    }

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
    }); 
}

export function useProjectTodos(projectId, token) {
    return useQuery({
        queryKey: ["projects", projectId, "todos"],
        queryFn: async () => {
            if (!token) {
                throw new Error("No token available");
            }
            const response = await fetch(`${serverEndpoint}/projects/${projectId}/todos/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.json();
        },
    });
}

export function useCreateProjectTodos(projectId, token, queryClient) {
    const postProjectTodo = async (newTodo) => {
        const response = await fetch(`${serverEndpoint}/projects/${projectId}/todos/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
            throw new Error("Failed to create project todo");
        }

        return response.json();
    };

    return useMutation({
        mutationFn: postProjectTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:["projects", projectId, "todos"] });
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "logs"] });
        },
    });
}

export function useCreateProjectMembership(projectId, token, queryClient) {
    const postProjectMembership = async ({username, role}) => {
        const response = await fetch(`${serverEndpoint}/projects/${projectId}/memberships/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                user: username,
                role: role
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create project membership");
        }

        return response.json();
    };

    return useMutation({
        mutationFn: postProjectMembership,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useProjectLogs(projectId, token) {
    const getProjectLogs = async () => {
        const response = await fetch(`${serverEndpoint}/projects/${projectId}/logs/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to get project logs");
        }

        return response.json();
    }

    return useQuery({
        queryKey: ["projects", projectId, "logs"],
        queryFn: getProjectLogs
    });
}
