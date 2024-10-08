import React, { useState } from 'react';
import styles from './Footer.module.css';
import { Link } from "react-router-dom";
import { ContactForm } from "../ContactForm/ContactForm.js";
import github from '../../assets/github.svg';



export function Footer() {

    return (
        <div className={styles.footer}>
            <div className={styles.mainFooter}>
                <div className={styles.linkContainer}>
                    <Link className={styles.menuItem} to='/'>Acceleration to Top Speed</Link>
                    <Link className={styles.menuItem} to='/time'>Time Calculator</Link>
                </div>
                <a href="https://github.com/M-D-Hoang/bike-calculator" target='_blank' rel="noreferrer ">
                    <img src={github} alt="github" />
                </a>
            </div>
        </div>
    );
}