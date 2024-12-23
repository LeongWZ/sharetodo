import { useMutation, useQuery } from '@tanstack/react-query';
import { isAuthenticated } from '../../util/auth';

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

export const useUser = (token) => {
    const userUrl = `${serverEndpoint}/auth/user/`;

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            if (!isAuthenticated(token)) {
                return null;
            }
            
            const response = await fetch(userUrl, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            return response.json();
        },
    });
};

export const useForgetPassword = () => {
    const postForgetPassword = async ({ email }) => {
        const response = await fetch(`${serverEndpoint}/auth/password/reset/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to reset password');
        }

        return response.json();
    }

    return useMutation({
        mutationFn: postForgetPassword,
    });
};

export const useResetPassword = () => {
    const postResetPassword = async ({ uid, token, password1, password2 }) => {
        const response = await fetch(`${serverEndpoint}/auth/password/reset/confirm/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid,
                token,
                new_password1: password1,
                new_password2: password2
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to reset password: ${JSON.stringify(data)}`);
        }

        return data;
    }

    return useMutation({
        mutationFn: postResetPassword,
    });
}
