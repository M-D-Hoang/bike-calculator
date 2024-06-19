import React, { useEffect, useRef, useState } from "react";
import JXG from 'jsxgraph';
import styles from "./TopSpeedGraph.module.css";
import { calculateTheoreticalMaxSpeed, accelerationToPercentOfMaxSpeed } from "../../utils/calculations.js";

export function TopSpeedGraph({ variablesArray }) {
    const boardRef = useRef(null);
    const [speedInfo, setSpeedInfo] = useState({ time1: null, time2: null, speed: null });


    useEffect(() => {
        if (variablesArray[0] == null || variablesArray[1] == null) {
            return;
        }

        const g = 9.81; // gravity in m/s^2
        const dt = 0.01; // Time step in seconds

        const variables1 = variablesArray[0];
        const variables2 = variablesArray[1];
        const maxTheoreticalSpeed1 = calculateTheoreticalMaxSpeed(variables1.power, variables1.systemWeight, variables1.airDensity, variables1.dragCoefficient, variables1.frontalArea, g, variables1.rollingResistanceCoefficient, variables1.drivetrainLossFactor, variables1.percentGrade, variables1.windSpeed);
        const maxTheoreticalSpeed2 = calculateTheoreticalMaxSpeed(variables2.power, variables2.systemWeight, variables2.airDensity, variables2.dragCoefficient, variables2.frontalArea, g, variables2.rollingResistanceCoefficient, variables2.drivetrainLossFactor, variables2.percentGrade, variables2.windSpeed);
        const result1 = accelerationToPercentOfMaxSpeed(variables1.power, variables1.systemWeight, variables1.airDensity, variables1.dragCoefficient, variables1.frontalArea, g, variables1.rollingResistanceCoefficient, variables1.drivetrainLossFactor, variables1.percentGrade, variables1.windSpeed, dt, maxTheoreticalSpeed1);
        const result2 = accelerationToPercentOfMaxSpeed(variables2.power, variables2.systemWeight, variables2.airDensity, variables2.dragCoefficient, variables2.frontalArea, g, variables2.rollingResistanceCoefficient, variables2.drivetrainLossFactor, variables2.percentGrade, variables2.windSpeed, dt, maxTheoreticalSpeed2);

        const maximumSpeedCharted = Math.max(result1.speeds[result1.speeds.length - 1], result2.speeds[result2.speeds.length - 1]); // Metrics for chart alignment
        const maximumTimeCharted = Math.max(result1.times[result1.times.length - 1], result2.times[result2.times.length - 1]); // Metrics for chart alignment

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-maximumTimeCharted * 0.2, maximumSpeedCharted * 1.2, maximumTimeCharted * 1.2, -maximumSpeedCharted * 0.2], // Adjusted to display speed in km/h
            axis: true,
            showCopyright: false,
        });

        // Add Units
        board.create('text', [maximumTimeCharted * 0.5, -maximumSpeedCharted * 0.1, 'Time (s)'], { fixed: true });
        board.create('text', [-maximumTimeCharted * 0.19, maximumSpeedCharted * 0.5, 'Speed (km/h)'], { fixed: false });

        // Plot speed over time curve
        var curve1 = board.create('curve', [result1.times, result1.speeds], { strokeColor: 'red', strokeWidth: 2 });
        var curve2 = board.create('curve', [result2.times, result2.speeds], { strokeColor: 'blue', strokeWidth: 2 });

        const getInterpolatedX = (result, y) => {
            for (let i = 0; i < result.speeds.length - 1; i++) {
                if (Math.abs(y - result.speeds[i]) < 0.1) {
                    return result.times[i];
                }
            }
            return null;
        };

        const handleMouseMove = (e) => {
            const coords = board.getUsrCoordsOfMouse(e);
            const speed = coords[1]; // y-coordinate

            const time1 = getInterpolatedX(result1, speed);
            const time2 = getInterpolatedX(result2, speed);


            setSpeedInfo({ time1, time2, speed });
        };

        curve1.on('move', handleMouseMove);
        curve2.on('move', handleMouseMove);

        return () => {
            board.off('move', handleMouseMove);
            JXG.JSXGraph.freeBoard(board);
        };
    }, [variablesArray]);

    return (
        <div className={styles.graph}>
            <h1>Acceleration</h1>
            <div className={styles.speedInfoContainer}>
                <p className={styles.speedInfo}>Speed: {speedInfo.speed !== null ? speedInfo.speed.toFixed(2) + 'km/h ' : '-- '}</p>
                <p className={styles.speedInfo} style={{ color: 'red' }}>Red: {speedInfo.time1 !== null ? speedInfo.time1.toFixed(2) + 's ' : '-- '}</p>
                <p className={styles.speedInfo} style={{ color: 'blue' }}>Blue: {speedInfo.time2 !== null ? speedInfo.time2.toFixed(2) + 's ' : '-- '}</p>
            </div>
            <div id="jxgbox" className={styles.jxgbox} ref={boardRef} style={{ width: '600px', height: '600px' }}></div>
        </div>
    );
}
