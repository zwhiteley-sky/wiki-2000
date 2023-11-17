import { useState, useEffect, FormEvent } from "react";
import * as EmailValidator from "email-validator";
import LoginInput from "../components/LoginInput";
import styles from "./Login.module.scss";
import { useAuthState } from "../components/AuthProvider";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

export function login_loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    let redirect = url.searchParams.get("redirect");

    // NOTE: useNavigate _should_ protect against open
    // navigation attacks but, just to be safe, enforcing
    // all URLs to start with `/` is another layer
    if (!redirect || redirect[0] !== "/") redirect = "/";

    return { redirect };
}

export default function Login() {
    // The current login information
    const [auth, login, , ] = useAuthState();
    
    // The form fields
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    
    // Whether the button is disabled
    const [disabled, set_disabled] = useState(true);
    
    // Whether the details provided were invalid
    // (used to show "invalid email or password" message)
    const [invalid_details, set_invalid_details] = useState(false);
    
    // The path to redirect to upon successful login
    const { redirect } = useLoaderData() as { redirect: string };
    
    // Navigate to another page
    const navigate = useNavigate();
 
    useEffect(() => {
        // Check the auth status 
        switch (auth.status) {
            case "loading":
                break;
            case "logged-in":
                // If the user is logged in, redirect them.
                // If they want to login as another user,
                // they'll have to logout first.
                navigate(redirect);
                break;
            case "logged-out":
                // NOTE: the button is disabled initially
                // as we do not know if the user is
                // logged in or not. Once we know that they
                // are logged out, we can enable the button
                set_disabled(false);
                break;
        }
    }, [auth])

    // Handle form submissions
    async function handler_submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // If the button is disabled, do not process
        if (disabled) return;

        // Validate the email and password
        if (!EmailValidator.validate(email) || !password) {
            return;
        }

        // Disable the button to prevent additional submissions
        set_disabled(true);
        
        // Log the user in
        const result = await login(email, password);

        // If the details were correct, redirect the user
        // to the correct path
        if (result) navigate(redirect);
        else { 
            // Otherwise, if they details were incorrect,
            // re-enable the button (to allow a second login
            // attempt and show the "invalid email or password"
            // prompt)
            set_disabled(false);
            set_invalid_details(true);
        }
    }

    // Whether the email is valid
    const email_valid = EmailValidator.validate(email);
    
    // Whether the password is valid
    const password_valid = !!password;

    return (
        <form className={styles.box} onSubmit={(event) => handler_submit(event)}>
            <h1>Login</h1>
            <LoginInput 
                name="email" 
                symbol="✉️"
                placeholder="Email"
                state={email_valid ? "valid" : "invalid"}
                value={email}
                onChange={set_email}
            />
            <LoginInput
                name="password"
                symbol="🔑"
                type="password"
                placeholder="Password"
                state={password_valid ? "valid" : "invalid"}
                value={password}
                onChange={set_password}
            />
            <div style={{
                display: invalid_details ? "block" : "none",
                color: "red",
            }}>Invalid email or password</div>
            <input type="submit" value="Login!" disabled={disabled || !email_valid || !password_valid}></input>
            <br /><br />
            <Link to="/register">Register instead?</Link>
        </form>
    )
}