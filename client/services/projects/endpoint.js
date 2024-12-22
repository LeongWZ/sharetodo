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
            queryClient.invalidateQueries(["projects", projectId, "todos"]);
        },
    });
}