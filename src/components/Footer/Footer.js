import React, { useState } from 'react';
import styles from './Footer.module.css';
import { Link } from "react-router-dom";
import { ContactForm } from "../ContactForm/ContactForm.js";


export function Footer() {

    return (
        <div className={styles.footer}>
            <div className={styles.mainFooter}>
                <div className={styles.linkContainer}>
                    <Link className={styles.menuItem} to='/'>Acceleration to Top Speed</Link>
                    <Link className={styles.menuItem} to='/time'>Time Calculator</Link>
                </div>
                <ContactForm />
            </div>
            <p className={styles.copyright}> Minh Duc Hoang &copy;2024</p>
        </div>
    );
}