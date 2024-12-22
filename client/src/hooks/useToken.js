import { useCookies } from "react-cookie";
import { TOKEN_COOKIE_KEY } from "../util/constants";

const EXPIRATION_DAYS = import.meta.env.VITE_TOKEN_EXPIRATION_DAYS ?? 7;

export default function useToken() {
    const [cookies, setCookie, removeCookie] = useCookies([TOKEN_COOKIE_KEY]);

    const setToken = (token) => {
        const expiryDate = new Date(Date.now() + daysToMs(EXPIRATION_DAYS));

        setCookie(TOKEN_COOKIE_KEY, token, {
            expires: expiryDate,
            path: "/",
            sameSite: "strict",
        });
    };

    const removeToken = () => {
        removeCookie(TOKEN_COOKIE_KEY, {
            path: "/",
            sameSite: "strict",
        });
    };

    return [cookies?.token, setToken, removeToken];
}

function daysToMs(days) {
    return days * 24 * 60 * 60 * 1000;
}