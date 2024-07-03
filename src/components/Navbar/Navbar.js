import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from "react-router-dom";
import hamburger from '../../assets/Hamburger_icon.png';


export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };



    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbar}>
                <h1>Better Bike Calculator</h1>
                <img className={styles.menuIcon} src={hamburger} alt="menu" onClick={toggleMenu} />
            </div>
            <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <Link className={styles.menuItem} to='/' onClick={toggleMenu}>Acceleration Calculator</Link>
                <Link className={styles.menuItem} to='/time' onClick={toggleMenu}>Time Calculator</Link>
            </div>
        </div>
    );
}