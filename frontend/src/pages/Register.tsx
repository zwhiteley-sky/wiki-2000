import { useState, useEffect, FormEvent } from "react";
import * as EmailValidator from "email-validator";
import LoginInput from "../components/LoginInput";
import styles from "./Login.module.scss";
import { useAuthState } from "../components/AuthProvider";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

const NAME_REGEX = /^[a-zA-Z ]+$/;

export function register_loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    let redirect = url.searchParams.get("redirect");

    // NOTE: useNavigate _should_ protect against open
    // navigation attacks but, just to be safe, enforcing
    // all URLs to start with `/` is another layer
    if (!redirect || redirect[0] !== "/") redirect = "/";

    return { redirect };
}

export default function Register() {
    // The current login information
    const [auth, , register, ] = useAuthState();
    
    // The form fields
    const [name, set_name] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [repeat_password, set_repeat_password] = useState("");
    
    // Whether the button is disabled
    const [disabled, set_disabled] = useState(true);
    
    // Whether the details provided were invalid
    // (used to show "invalid email or password" message)
    const [email_taken, set_email_taken] = useState(false);
    
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
        if (!NAME_REGEX.test(name) || !EmailValidator.validate(email) || !password) {
            return;
        }

        // Disable the button to prevent additional submissions
        set_disabled(true);
        
        // Log the user in
        const result = await register(name, email, password);

        // If the details were correct, redirect the user
        // to the correct path
        if (result === "success") navigate("/login?redirect=" + encodeURIComponent(redirect));
        else if (result === "email-taken") { 
            // Otherwise, if they details were incorrect,
            // re-enable the button (to allow a second login
            // attempt and show the "invalid email or password"
            // prompt)
            set_disabled(false);
            set_email_taken(true);
        } else set_disabled(false);
    }

    // Whether the name is valid
    const name_valid = NAME_REGEX.test(name);

    // Whether the email is valid
    const email_valid = EmailValidator.validate(email);
    
    // Whether the password is valid
    const password_valid = !!password;
    const repeat_valid = password === repeat_password;

    return (
        <form className={styles.box} onSubmit={(event) => handler_submit(event)}>
            <h1>Register</h1>
            <LoginInput 
                name="name" 
                symbol="️😀"
                placeholder="Name"
                state={name_valid ? "valid" : "invalid"}
                value={name}
                onChange={set_name}
            />
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
            <LoginInput
                name="repeat-password"
                symbol="🗝️"
                type="password"
                placeholder="Repeat Password"
                state={repeat_valid ? "valid" : "invalid"}
                value={repeat_password}
                onChange={set_repeat_password}
            />
            <div style={{
                display: email_taken ? "block" : "none",
                color: "red",
            }}>Email is taken</div>
            <input 
                type="submit" 
                value="Register!" 
                disabled={
                    disabled || 
                    !name_valid ||
                    !email_valid || 
                    !password_valid ||
                    !repeat_valid
                }
            />
            <br /><br />
            <Link to="/login">Login instead?</Link>
        </form>
    )
}