import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styles from "./ContactForm.module.css";

export function ContactForm() {
    const [state, handleSubmit] = useForm("mkgwnznw");

    return (
        
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Contact</h3>
            <label htmlFor="email">
                Email Address
                <input
                    id="email"
                    type="email"
                    name="email"
                />
            </label>

            <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
            />

            <label htmlFor="message">
                Message
                <textarea
                    id="message"
                    name="message"
                />
            </label>

            <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
            />
            <button type="submit" disabled={state.submitting}>
                Submit
            </button>
            {state.succeeded && <p>Thanks for your message!</p>}
        </form>
    );
}