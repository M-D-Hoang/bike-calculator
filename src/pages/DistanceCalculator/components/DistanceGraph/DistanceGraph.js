import React, { useEffect, useRef, useState, useMemo } from "react";
import JXG from 'jsxgraph';
import styles from "./DistanceGraph.module.css";
import { accelerationToCoverDistance, calculateTheoreticalMaxSpeed } from "../../../../utils/calculations.js";

export function DistanceGraph({ variablesArray }) {
    const boardRef = useRef(null);
    const [speedInfo, setSpeedInfo] = useState({
        time1String: null,
        time1FasterString: null,
        time2String: null,
        time2FasterString: null
    });
    const [maximumSpeedInfo, setMaximumSpeedInfo] = useState({ maxTheoreticalSpeed1: null, speed1Faster: null, maxTheoreticalSpeed2: null, speed2Faster: null });


    const g = 9.81; // gravity in m/s^2
    var dt = 0.01; // Time step in seconds

    const [result1, result2, maximumSpeedCharted, maximumTimeCharted] = useMemo(() => {
        if (!variablesArray[0] || !variablesArray[1]) return [null, null, 0, 0];

        const [variables1, variables2] = variablesArray;
        if (variables1.distance > 10000 || variables2.distance > 10000) {
            const maxDistance = Math.max(variables1.distance, variables2.distance);
            dt = Math.floor(maxDistance / 10000) * 0.01;
        }
        // if (variables1.distance > 50000 || variables2.distance > 50000) {
        //     dt = 0.1;
        // }

        const result1 = accelerationToCoverDistance(
            variables1.power, variables1.systemWeight, variables1.airDensity, variables1.dragCoefficient, variables1.frontalArea, g,
            variables1.rollingResistanceCoefficient, variables1.drivetrainLossFactor, variables1.percentGrade, variables1.windSpeed, dt,
            variables1.wheelWeight, variables1.distance, variables1.deceleration
        );
        const result2 = accelerationToCoverDistance(
            variables2.power, variables2.systemWeight, variables2.airDensity, variables2.dragCoefficient, variables2.frontalArea, g,
            variables2.rollingResistanceCoefficient, variables2.drivetrainLossFactor, variables2.percentGrade, variables2.windSpeed, dt,
            variables2.wheelWeight, variables2.distance, variables2.deceleration
        );

        const maxTheoreticalSpeed1 = calculateTheoreticalMaxSpeed(
            variables1.power, variables1.systemWeight, variables1.airDensity, variables1.dragCoefficient, variables1.frontalArea, g,
            variables1.rollingResistanceCoefficient, variables1.drivetrainLossFactor, variables1.percentGrade, variables1.windSpeed
        );
        const maxTheoreticalSpeed2 = calculateTheoreticalMaxSpeed(
            variables2.power, variables2.systemWeight, variables2.airDensity, variables2.dragCoefficient, variables2.frontalArea, g,
            variables2.rollingResistanceCoefficient, variables2.drivetrainLossFactor, variables2.percentGrade, variables2.windSpeed
        );

        var speed1Faster = null;
        var speed2Faster = null;

        if (maxTheoreticalSpeed1 > maxTheoreticalSpeed2) {
            speed1Faster = "+" + (maxTheoreticalSpeed1 - maxTheoreticalSpeed2).toFixed(2) + "(" + ((maxTheoreticalSpeed1 - maxTheoreticalSpeed2) / maxTheoreticalSpeed2 * 100).toFixed(2) + '%)';
        } else if (maxTheoreticalSpeed1 < maxTheoreticalSpeed2) {
            speed2Faster = "+" + (maxTheoreticalSpeed2 - maxTheoreticalSpeed1).toFixed(2) + "(" + ((maxTheoreticalSpeed2 - maxTheoreticalSpeed1) / maxTheoreticalSpeed1 * 100).toFixed(2) + '%)';
        }

        setMaximumSpeedInfo({ maxTheoreticalSpeed1, speed1Faster, maxTheoreticalSpeed2, speed2Faster });

        const maximumSpeedCharted = Math.max(maxTheoreticalSpeed1, maxTheoreticalSpeed2);
        const maximumTimeCharted = Math.max(result1.times[result1.times.length - 1], result2.times[result2.times.length - 1]);

        return [result1, result2, maximumSpeedCharted, maximumTimeCharted];
    }, [variablesArray]);

    useEffect(() => {
        if (!result1 || !result2) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-maximumTimeCharted * 0.2, maximumSpeedCharted * 1.2, maximumTimeCharted * 1.2, -maximumSpeedCharted * 0.2],
            axis: true,
            showCopyright: false,
        });

        // Add Units 
        board.create('text', [maximumTimeCharted * 0.5, -maximumSpeedCharted * 0.1, 'Time (s)'], { fixed: true });
        board.create('text', [-maximumTimeCharted * 0.19, maximumSpeedCharted * 0.5, 'Speed (km/h)'], { fixed: false });

        // Plot speed over time curves
        board.create('curve', [result1.times, result1.speeds], { strokeColor: 'red', strokeWidth: 2 });
        board.create('curve', [result2.times, result2.speeds], { strokeColor: 'blue', strokeWidth: 2 });

        const time1 = result1.times[result1.times.length - 1];
        const time2 = result2.times[result2.times.length - 1];

        var time1String;
        var time2String;
        time1 > 36000 ? time1String = '>36000.00s' : time1String = `${time1.toFixed(2)}s`;
        time2 > 36000 ? time2String = '>36000s.00' : time2String = `${time2.toFixed(2)}s`;

        let time1FasterString = null;
        let time2FasterString = null;
        if (time1 !== null && time2 !== null) {
            if (time1 < time2) {
                time1FasterString = (time1 - time2).toFixed(2) + 's(' + ((time1 - time2) / time2 * 100).toFixed(2) + '%)';
            } else if (time1 > time2) {
                time2FasterString = (time2 - time1).toFixed(2) + 's(' + ((time2 - time1) / time1 * 100).toFixed(2) + '%)';
            }
        }
        setSpeedInfo({ time1String, time1FasterString, time2String, time2FasterString });

        // Cleanup function to free the JSXGraph board
        return () => {
            JXG.JSXGraph.freeBoard(board);
        };
    }, [result1, result2, maximumSpeedCharted, maximumTimeCharted]);

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
                <p className={styles.infoContainer}>Time: </p>
                <div className={styles.infoContainer}>
                    <p className={styles.speedInfo} style={{ color: 'red' }}>{speedInfo.time1String ?? '--'}</p>
                    <p className={styles.speedInfo} style={{ color: 'green' }}>{speedInfo.time1FasterString ?? ''}</p>
                </div>
                <div className={styles.infoContainer}>
                    <p className={styles.speedInfo} style={{ color: 'blue' }}>{speedInfo.time2String ?? '--'}</p>
                    <p className={styles.speedInfo} style={{ color: 'green' }}>{speedInfo.time2FasterString ?? ''}</p>
                </div>
            </div>
            <div id="jxgbox" className={styles.jxgbox} ref={boardRef} style={{ width: '600px', height: '600px' }}></div>
        </div>
    );
}
