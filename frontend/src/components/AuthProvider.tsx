import { createContext, useState, useEffect, useContext } from "react"
import { Outlet } from "react-router-dom";

/**
 * The current auth status.
 */
export type AuthState = LoggedIn | LoggedOut | Loading;

/**
 * The user is logged in.
 */
export type LoggedIn = {
    status: "logged-in",
    id: string,
    email: string,
    name: string,
    token: string
};

/**
 * The user is logged out
 */
export type LoggedOut = {
    status: "logged-out",
};

/**
 * The login details are loading.
 */
export type Loading = {
    status: "loading"
};

/**
 * The result of the register method.
 */
export type RegisterResult = "success" | "unknown" | "email-taken";

/**
 * The key for the authentication entry in local storage.
 */
const AUTH_STORAGE_KEY = "auth";

/**
 * The authentication details entry.
 */
const auth_context = createContext({ status: "loading" } as AuthState);

/**
 * The context which holds the method to set the authentication
 * details (in React state, not localStorage).
 */
const set_auth_context = createContext(
    null as ((state: AuthState) => void) | null
);

/**
 * The component which provides the auth state information.
 */
export function AuthProvider() {
    const [auth_state, set_auth_state] = useState({
        status: "loading"
    } as AuthState);

    useEffect(() => {
        const auth_string = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!auth_string) {
            set_auth_state({ status: "logged-out" });
            return;
        }

        const auth_details = JSON.parse(auth_string) as LoggedIn;
        set_auth_state(auth_details);
    }, []);

    return (
        <auth_context.Provider value={auth_state}>
            <set_auth_context.Provider value={set_auth_state}>
                <Outlet />
            </set_auth_context.Provider>
        </auth_context.Provider>
    );
}

/**
 * The auth state hook.
 * @returns The auth state, a login method, and a logout method.
 */
export function useAuthState(): [
    AuthState,
    (email: string, password: string) => Promise<boolean>,
    (name: string, email: string, password: string) => Promise<RegisterResult>,
    () => Promise<void>
] {
    const auth_state = useContext(auth_context);
    const set_auth_state = useContext(set_auth_context);

    async function login(email: string, password: string): Promise<boolean> {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.status !== 200) return false;
        
        const body: any = await response.json();
        const state: AuthState = {
            status: "logged-in",
            ...body
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
        set_auth_state!(state);
        return true;
    }

    async function register(name: string, email: string, password: string): Promise<RegisterResult> {
        const response = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, email, password
            })
        });

        if (response.status === 403) return "email-taken";
        if (response.status !== 204) return "unknown";

        return "success";
    }

    async function logout(): Promise<void> {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        set_auth_state!({ status: "logged-out" });
    }

    return [auth_state, login, register, logout];
}