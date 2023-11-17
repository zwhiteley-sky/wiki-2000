import { ChangeEvent, useState } from "react";
import styles from "./LoginInput.module.scss";

export default function LoginInput(
    {
        // The name of the input
        name, 
        
        // The symbol to use in the circle
        symbol,
        
        // The state (whether its valid or invalid)
        state,
        
        // The type of the inner input
        type,
        
        // The value of the input
        value,
        
        // The placeholder to show in the input
        placeholder,
        
        // The event handler
        onChange
    }: { 
        name?: string, 
        symbol?: string
        state: "valid" | "invalid" | "neutral", 
        type?: string,
        value?: string,
        placeholder?: string,
        onChange?: (value: string) => void,
    }
) {
    // Whether the input has been visited
    const [dirty, set_dirty] = useState(false);
    
    // The base class name
    let className = styles.container;

    // Handle an input change
    function handle_input(event: ChangeEvent<HTMLInputElement>) {
        if (onChange) onChange(event.currentTarget.value);
    }

    // If the input has been visited, colour it either
    // valid or invalid, so the user knows if they need
    // to change it
    if (dirty) { 
        switch (state) {
            case "valid":
                className += " " + styles.valid;
                break;
            case "neutral":
                className += " " + styles.neutral;
                break;
            case "invalid":
                className += " " + styles.invalid;
                break;
        }
    }
    // Otherwise, automatically set it to neutral (there's
    // no point marking an input as invalid if the user
    // hasn't even had the chance to visit it)
    else className += " " + styles.neutral;

    return (
        <div className={className}>
            <input 
                name={name} 
                type={type ?? "text"}
                value={value} 
                placeholder={placeholder}
                onFocus={() => set_dirty(true)}
                onChange={handle_input}
            />
            
            <div className={styles.circle}>{symbol}</div>
        </div>
    )
}