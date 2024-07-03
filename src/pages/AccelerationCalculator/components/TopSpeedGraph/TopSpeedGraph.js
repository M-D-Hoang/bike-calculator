import React, { useEffect, useRef, useState } from "react";
import JXG from 'jsxgraph';
import styles from "./TopSpeedGraph.module.css";
import { calculateTheoreticalMaxSpeed, accelerationToPercentOfMaxSpeed } from "../../../../utils/calculations.js";

export function TopSpeedGraph({ variablesArray }) {
    const boardRef = useRef(null);
    const [speedInfo, setSpeedInfo] = useState({ time1String: null, time1FasterString: null, time2String: null, time2FasterString: null, speed: null });
    const [maximumSpeedInfo, setMaximumSpeedInfo] = useState({ maxTheoreticalSpeed1: null, speed1Faster: null,  maxTheoreticalSpeed2: null, speed2Faster: null });

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
        const result1 = accelerationToPercentOfMaxSpeed(variables1.power, variables1.systemWeight, variables1.airDensity, variables1.dragCoefficient, variables1.frontalArea, g, variables1.rollingResistanceCoefficient, variables1.drivetrainLossFactor, variables1.percentGrade, variables1.windSpeed, dt, maxTheoreticalSpeed1, variables1.wheelWeight);
        const result2 = accelerationToPercentOfMaxSpeed(variables2.power, variables2.systemWeight, variables2.airDensity, variables2.dragCoefficient, variables2.frontalArea, g, variables2.rollingResistanceCoefficient, variables2.drivetrainLossFactor, variables2.percentGrade, variables2.windSpeed, dt, maxTheoreticalSpeed2, variables2.wheelWeight);

        var speed1Faster = null;
        var speed2Faster = null;

        if (maxTheoreticalSpeed1 > maxTheoreticalSpeed2) {
            speed1Faster = "+" + (maxTheoreticalSpeed1 - maxTheoreticalSpeed2).toFixed(2) + "(" + ((maxTheoreticalSpeed1 - maxTheoreticalSpeed2) / maxTheoreticalSpeed2 * 100).toFixed(2) + '%)';
        } else if (maxTheoreticalSpeed1 < maxTheoreticalSpeed2) {
            speed2Faster = "+" + (maxTheoreticalSpeed2 - maxTheoreticalSpeed1).toFixed(2) + "(" + ((maxTheoreticalSpeed2 - maxTheoreticalSpeed1) / maxTheoreticalSpeed1 * 100).toFixed(2) + '%)';
        }

        setMaximumSpeedInfo({ maxTheoreticalSpeed1, speed1Faster, maxTheoreticalSpeed2, speed2Faster });
        

        // Metrics for chart alignment
        const maximumSpeedCharted = Math.max(result1.speeds[result1.speeds.length - 1], result2.speeds[result2.speeds.length - 1]);
        const maximumTimeCharted = Math.max(result1.times[result1.times.length - 1], result2.times[result2.times.length - 1]);

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-maximumTimeCharted * 0.2, maximumSpeedCharted * 1.2, maximumTimeCharted * 1.2, -maximumSpeedCharted * 0.2],
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
            // Use destructuring for cleaner code
            const [, yCoord] = board.getUsrCoordsOfMouse(e);
            const speed = yCoord.toFixed(2); // y-coordinate

            // Get interpolated times
            const time1 = getInterpolatedX(result1, speed);
            const time2 = getInterpolatedX(result2, speed);

            // Convert times to strings, if they are not null
            const time1String = time1 !== null ? `${time1.toFixed(2)}s` : null;
            const time2String = time2 !== null ? `${time2.toFixed(2)}s` : null;

            let time1FasterString = null;
            let time2FasterString = null;

            // Calculate the difference if both times are valid
            if (time1 !== null && time2 !== null) {
                if (time1 < time2) {
                    time1FasterString = (time1 - time2).toFixed(2) + 's(' + ((time1 - time2) / time2 * 100).toFixed(2) + '%)';
                } else if (time1 > time2) {
                    time2FasterString = (time2 - time1).toFixed(2) + 's(' + ((time2 - time1) / time1 * 100).toFixed(2) + '%)';
                }
            }

            setSpeedInfo({
                time1String,
                time1FasterString,
                time2String,
                time2FasterString,
                speed
            });
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
            <div className={styles.speedInfoContainer}>
                <p className={styles.infoContainer}>Top Speed: </p>
                <div className={styles.infoContainer}>
                    <p className={styles.speedInfo} style={{ color: 'red' }}>{maximumSpeedInfo.maxTheoreticalSpeed1 !== null ? maximumSpeedInfo.maxTheoreticalSpeed1.toFixed(2) + 'km/h' : '--'}</p>
                    <p className={styles.speedInfo} style={{ color: 'green' }}>{maximumSpeedInfo.speed1Faster !== null ? maximumSpeedInfo.speed1Faster : ''}</p>
                </div>
                <div className={styles.infoContainer}>
                    <p className={styles.speedInfo} style={{ color: 'blue' }}>{maximumSpeedInfo.maxTheoreticalSpeed2 !== null ? maximumSpeedInfo.maxTheoreticalSpeed2.toFixed(2) + 'km/h' : '--'}</p>
                    <p className={styles.speedInfo} style={{ color: 'green' }}>{maximumSpeedInfo.speed2Faster !== null ? maximumSpeedInfo.speed2Faster : ''}</p>
                </div>
            </div>
            <div className={styles.speedInfoContainer}>
                <p className={styles.infoContainer}>{speedInfo.speed !== null ? '@' + speedInfo.speed + 'km/h:' : '--'}</p>
                <div className={styles.infoContainer}>
                    <p className={styles.speedInfo} style={{ color: 'red' }}>{speedInfo.time1String !== null ? speedInfo.time1String : '--'}</p>
                    <p className={styles.speedInfo} style={{ color: 'green' }}>{speedInfo.time1FasterString !== null ? speedInfo.time1FasterString : ''}</p>
                </div>
                <div className={styles.infoContainer}>
                    <p className={styles.speedInfo} style={{ color: 'blue' }}>{speedInfo.time2String !== null ? speedInfo.time2String : '--'}</p>
                    <p className={styles.speedInfo} style={{ color: 'green' }}>{speedInfo.time2FasterString !== null ? speedInfo.time2FasterString : ''}</p>
                </div>
            </div>
            <div id="jxgbox" className={styles.jxgbox} ref={boardRef} style={{ width: '600px', height: '600px' }}></div>
        </div>
    );
}
