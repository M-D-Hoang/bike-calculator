import React, { useEffect, useRef } from 'react';
import styles from "./VariableForm.module.css";

export function VariableForm({ submitVariables }) {
    const formRef = useRef(null);
    const firstRender = useRef(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const variables1 = {
            power: Number(data.get('power1')),
            systemWeight: Number(data.get('body-weight1')) + Number(data.get('bike-weight1')),
            wheelWeight: Number(data.get('wheel-weight1')),
            airDensity: Number(data.get('air-density1')),
            dragCoefficient: Number(data.get('drag-coefficient1')),
            frontalArea: Number(data.get('frontal-area1')),
            rollingResistanceCoefficient: Number(data.get('rolling-resistance-coefficient1')),
            drivetrainLossFactor: Number(data.get('drivetrain-loss-factor1')),
            percentGrade: Number(data.get('percent-grade1')),
            windSpeed: Number(data.get('wind-speed1')),
        };
        const variables2 = {
            power: Number(data.get('power2')),
            systemWeight: Number(data.get('body-weight2')) + Number(data.get('bike-weight2')),
            wheelWeight: Number(data.get('wheel-weight2')),
            airDensity: Number(data.get('air-density2')),
            dragCoefficient: Number(data.get('drag-coefficient2')),
            frontalArea: Number(data.get('frontal-area2')),
            rollingResistanceCoefficient: Number(data.get('rolling-resistance-coefficient2')),
            drivetrainLossFactor: Number(data.get('drivetrain-loss-factor2')),
            percentGrade: Number(data.get('percent-grade2')),
            windSpeed: Number(data.get('wind-speed2')),
        };

        submitVariables([variables1, variables2]);
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            formRef.current.requestSubmit();
        }
    }, []);

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} onReset={() => formRef.current.requestSubmit()} ref={formRef}>
                <div className={styles.row}>
                    <h3 style={{ color: 'red' }}>Red</h3>
                    <h3 style={{ color: 'blue' }}>Blue</h3>
                </div>
                <div className={styles.row}>
                    <label>
                        Power (watts):
                        <input type="number" name="power1" defaultValue={250} required min={1} />
                    </label>
                    <label>
                        Power (watts):
                        <input type="number" name="power2" defaultValue={250} required min={1} />
                    </label>
                </div>
                <div className={styles.row}>
                    <label>
                        Body Weight (kg):
                        <input type="number" name="body-weight1" defaultValue={75} step={0.1} required min={1} />
                    </label>
                    <label>
                        Body Weight (kg):
                        <input type="number" name="body-weight2" defaultValue={75} step={0.1} required min={1} />
                    </label>
                </div>
                <div className={styles.row}>
                    <label>
                        Total Bike Weight (kg):
                        <input type="number" name="bike-weight1" defaultValue={10} step={0.01} required min={0} />
                    </label>
                    <label>
                        Total Bike Weight (kg):
                        <input type="number" name="bike-weight2" defaultValue={10} step={0.01} required min={0} />
                    </label>
                </div>
                <div className={styles.row}>
                    <label>
                        Total Wheel Weight (kg):
                        <input type="number" name="wheel-weight1" defaultValue={3} step={0.001} required min={0} />
                    </label>
                    <label>
                        Total Wheel Weight (kg):
                        <input type="number" name="wheel-weight2" defaultValue={3} step={0.001} required min={0} />
                    </label>
                </div>
                <div className={styles.row}>
                    <label>
                        Percent Grade (%):
                        <input type="number" name="percent-grade1" defaultValue={0} required />
                    </label>
                    <label>
                        Percent Grade (%):
                        <input type="number" name="percent-grade2" defaultValue={0} required />
                    </label>
                </div>
                <details>
                    <summary>Aerodynamics</summary>
                    <div className={styles.row}>
                        <label>
                            Tailwind (km/h):
                            <input type="number" name="wind-speed1" defaultValue={0} step={0.1} required />
                        </label>
                        <label>
                            Tailwind (km/h):
                            <input type="number" name="wind-speed2" defaultValue={0} step={0.1} required />
                        </label>
                    </div>
                    <div className={styles.row}>
                        <label>
                            Air Density (kg/m^3):
                            <input type="number" name="air-density1" defaultValue={1.225} step={0.001} required min={0} />
                        </label>
                        <label>
                            Air Density (kg/m^3):
                            <input type="number" name="air-density2" defaultValue={1.225} step={0.001} required min={0} />
                        </label>
                    </div>
                    <div className={styles.row}>
                        <label>
                            Drag Coefficient:
                            <input type="number" name="drag-coefficient1" defaultValue={0.7} step={0.01} required min={0} />
                        </label>
                        <label>
                            Drag Coefficient:
                            <input type="number" name="drag-coefficient2" defaultValue={0.7} step={0.01} required min={0} />
                        </label>
                    </div>
                    <div className={styles.row}>
                        <label>
                            Frontal Area (m^2):
                            <input type="number" name="frontal-area1" defaultValue={0.5} step={0.01} required min={0} />
                        </label>
                        <label>
                            Frontal Area (m^2):
                            <input type="number" name="frontal-area2" defaultValue={0.5} step={0.01} required min={0} />
                        </label>
                    </div>
                </details>
                <details>
                    <summary>Friction</summary>
                    <div className={styles.row}>
                        <label>
                            Rolling Resistance:
                            <input type="number" name="rolling-resistance-coefficient1" defaultValue={0.005} step={0.0001} required min={0} />
                        </label>
                        <label>
                            Rolling Resistance:
                            <input type="number" name="rolling-resistance-coefficient2" defaultValue={0.005} step={0.0001} required min={0} />
                        </label>
                    </div>
                    <div className={styles.row}>
                        <label>
                            Drivetrain Loss (%):
                            <input type="number" name="drivetrain-loss-factor1" defaultValue={2} step={0.1} required min={0} />
                        </label>
                        <label>
                            Drivetrain Loss (%):
                            <input type="number" name="drivetrain-loss-factor2" defaultValue={2} step={0.1} required min={0} />
                        </label>
                    </div>
                </details>
                <div className={styles.row}>
                    <input type="reset" value="Reset" />
                    <input type="submit" value="Submit" />
                </div>
            </form>
        </div>
    );
}
