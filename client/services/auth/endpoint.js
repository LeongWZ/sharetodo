import { useMutation } from '@tanstack/react-query';

const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;

export const useLogin = () => {
    const loginUrl = `${serverEndpoint}/auth/login/`;

    return useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            return data.key;
        },
    });
}

export const useRegistration = () => {
    const registrationUrl = `${serverEndpoint}/auth/registration/`;

    return useMutation({
        mutationFn: async ({ username, email, password1, password2 }) => {
            const response = await fetch(registrationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password1, password2 }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            return data.key;
        },
    });
}