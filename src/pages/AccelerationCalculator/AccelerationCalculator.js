import React, { useState } from "react";
import { TopSpeedGraph } from "./components/TopSpeedGraph/TopSpeedGraph.js";
import { VariableForm } from "./components/VariableForm/VariableForm.js";
import styles from "./AccelerationCalculator.module.css";
import background from "../../assets/background1.jpg";
import SimpleParallax from "simple-parallax-js";

export function AccelerationCalculator() {
    const [variablesArray, setVariablesArray] = useState({});

    function handleVariables(variablesArray) {
        setVariablesArray(variablesArray);
    }
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.backgroundOverlay}>
                    <h1 className={styles.title}>Acceleration Calculator</h1>
                    <p className={styles.belowTitle}>From zero to hero, how fast can you go? </p>
                </div>
                <SimpleParallax scale={2} delay={1} transition="cubic-bezier(0,0,0,1)" className={styles.parallax}>
                    <img className={styles.background} src={background} alt="bike" />
                </SimpleParallax>
            </div>
            <a className={styles.credit}>Photographer unknown</a>
            <div className={styles.mainSection}>
                <div className={styles.section}>
                    <p className={styles.description}>Compare the acceleration curves of two setups to 99% of their top speed. </p>
                </div>
                <div className={styles.calculator}>
                    <VariableForm submitVariables={handleVariables} />
                    <TopSpeedGraph variablesArray={variablesArray} />
                </div>
            </div>
            <div className={styles.info}>
                <h4>What are the effects of each parameter?</h4>
                <p>Power comes from your legs, the stronger you are, the faster you go.</p>
                <h5>Weight:</h5>
                <ul>
                    <li>Body weight and total weight are added to become total system weight</li>
                    <li>More mass means more inertia, meaning slower acceleration. Wheels (and tires, and tubes) have a larger impact on acceleration as they are also subject to rotational inertia. In this model, 60% of the mass is assumed to be at the circumference of the wheel, 40% distributed as a disc. Other rotating parts have negligible impact.</li>
                    <li>More weight also increases rolling resistance, reducing top speed and acceleration.</li>
                    <li>Weight also multiplies the effect of grade.</li>
                </ul>
                <h5>Aerodynamics:</h5>
                <ul>
                    <li>Tailwind is effectively subtracted from (or, if negative for headwind, added to) your actual speed to calculate the aerodynamic drag.</li>
                    <li>Drag increases linearly with air density, drag coefficient, and frontal area.</li>
                    <li>Drag increases with the square of speed (minus tailwind).</li>
                    <li>Aero components and mostly body position will affect drag coefficient and frontal area.</li>
                    <li>With the default values, drag accounts for 50% of the resistive force at 15-20km/h, and 80% of the resistive force at 30-35km/h.</li>
                </ul>
                <h5>Friction:</h5>
                <ul>
                    <li>Friction increases linearly with rolling resistance, drivetrain loss, and speed. </li>
                    <li>Rolling resistance can be reduced significantly with quality tires and adequate tire pressure.</li>
                    <li>Drivetrain loss can be reduced significantly with proper adjustments and lubrication.</li>
                    <li>With the default values, friction accounts for 50% of the resistive force at 15-20km/h, and 20% of the resistive force at 30-35km/h.</li>
                </ul>
                <p>The graphs show the simulation over a maximum of 600 seconds or until speed reaches 99% of the top speed (maximum of 180km/h) with a time step of 0.01 second.</p>
            </div>
        </div>
    );
}