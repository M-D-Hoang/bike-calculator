export function accelerationToPercentOfMaxSpeed(
    P, m, rho, Cd, A, g, rollingResistanceCoefficient, drivetrainLossFactor,
    percentGrade, windSpeed, dt, maxTheoreticalSpeed, wheelMass, percentOfMaxSpeed = 0.99
) {
    let v = 0; // Initial velocity in m/s
    let time = 0;
    const speeds = [0];
    const times = [0];

    const wheelRadius = 0.34;
    const windSpeedMs = windSpeed / 3.6; // Convert wind speed to m/s
    const maxSpeedMs = maxTheoreticalSpeed * percentOfMaxSpeed / 3.6; // Convert max theoretical speed to m/s
    const cosGrade = Math.cos(Math.atan(percentGrade / 100));
    const sinGrade = Math.sin(Math.atan(percentGrade / 100));
    const rollingResistanceForce = m * g * rollingResistanceCoefficient * cosGrade;
    const gradeResistanceForce = m * g * sinGrade;

    // Calculate wheel rotational inertia
    const hoopMass = 0.6 * wheelMass; // 60% of wheel mass at the edge
    const discMass = 0.4 * wheelMass; // 40% of wheel mass as disc
    const hoopInertia = hoopMass * wheelRadius * wheelRadius;
    const discInertia = 0.5 * discMass * wheelRadius * wheelRadius;
    const totalInertia = 2 * (hoopInertia + discInertia); // Two wheels
    const effectiveMass = m + totalInertia / (wheelRadius * wheelRadius);

    // Run simulation for a maximum of 600 seconds or until the target speed is reached
    while (time <= 600 && v < maxSpeedMs) {
        const vEff = v + windSpeedMs;
        const F_applied = P / Math.max(v, 0.1); // Avoid division by zero
        const F_d = 0.5 * rho * Cd * A * vEff * vEff; // Drag force including wind effect
        const F_drivetrain = F_applied * drivetrainLossFactor / 100; // Drivetrain losses
        const netForce = F_applied - F_d - rollingResistanceForce - F_drivetrain - gradeResistanceForce;
        const a = netForce / effectiveMass;

        v += a * dt;
        time += dt;

        speeds.push(v * 3.6); // Convert m/s to km/h
        times.push(time);
    }

    return { speeds, times };
}


export function calculateTheoreticalMaxSpeed(
    P, m, rho, Cd, A, g, rollingResistanceCoefficient, drivetrainLossFactor, percentGrade, windSpeed
) {
    const tolerance = 0.001; // Tolerance for the numerical solution
    let v_min = 0; // Lower bound of the search interval (m/s)
    let v_max = 50; // Upper bound of the search interval (m/s), a reasonable upper bound for a bicycle
    let v_mid;

    // Calculate net force at a given velocity
    function netForce(v) {
        const F_applied = P / Math.max(v, 0.1); // Avoid division by zero
        const windSpeedMs = windSpeed / 3.6; // Convert wind speed to m/s
        const F_d = 0.5 * rho * Cd * A * (v + windSpeedMs) * (v + windSpeedMs); // Drag force
        const cosGrade = Math.cos(Math.atan(percentGrade / 100));
        const sinGrade = Math.sin(Math.atan(percentGrade / 100));
        const F_rr = m * g * rollingResistanceCoefficient * cosGrade; // Rolling resistance
        const F_drivetrain = F_applied * drivetrainLossFactor / 100; // Drivetrain losses
        const F_grade = m * g * sinGrade; // Grade resistance
        return F_applied - F_d - F_rr - F_drivetrain - F_grade; // Net force
    }

    // Perform bisection method to find the velocity where net force is zero
    while (v_max - v_min > tolerance) {
        v_mid = (v_min + v_max) / 2;
        if (netForce(v_mid) > 0) {
            v_min = v_mid; // Increase lower bound
        } else {
            v_max = v_mid; // Decrease upper bound
        }
    }

    return v_mid * 3.6; // Convert m/s to km/h
}

export function accelerationToCoverDistance(
    P, m, rho, Cd, A, g, rollingResistanceCoefficient, drivetrainLossFactor,
    percentGrade, windSpeed, dt, wheelMass, distance, deceleration
) {
    let v = 0; // Initial velocity in m/s
    let time = 0;
    let currentDistance = 0;
    const speeds = [0];
    const times = [0];
    const distances = [0];

    const wheelRadius = 0.34; 
    const windSpeedMs = windSpeed / 3.6; // Convert wind speed to m/s
    const cosGrade = Math.cos(Math.atan(percentGrade / 100));
    const sinGrade = Math.sin(Math.atan(percentGrade / 100));
    const rollingResistanceForce = m * g * rollingResistanceCoefficient * cosGrade;
    const gradeResistanceForce = m * g * sinGrade;

    const hoopMass = 0.6 * wheelMass; // 60% of wheel mass at the edge
    const discMass = 0.4 * wheelMass; // 40% of wheel mass as disc
    const hoopInertia = hoopMass * (wheelRadius * wheelRadius);
    const discInertia = 0.5 * discMass * (wheelRadius * wheelRadius);
    const totalInertia = 2 * (hoopInertia + discInertia);
    const effectiveMass = m + totalInertia / (wheelRadius * wheelRadius);

    while (currentDistance < distance && time <= 36000) {
        let stoppingDistance = (deceleration !== 0) ? v * v / (2 * deceleration) : 0;

        if (currentDistance + stoppingDistance >= distance) {
            const tToStop = v / Math.abs(deceleration);
            const finalDistance = distance;
            const finalTime = time + tToStop;

            speeds.push(0); // Final speed is 0
            times.push(finalTime);
            distances.push(finalDistance);

            currentDistance = distance;
            time = finalTime;
        } else {
            const F_applied = P / Math.max(v, 0.1);
            const F_d = 0.5 * rho * Cd * A * (v + windSpeedMs) * (v + windSpeedMs);
            const F_drivetrain = F_applied * drivetrainLossFactor / 100;
            const a = (F_applied - F_d - rollingResistanceForce - F_drivetrain - gradeResistanceForce) / effectiveMass;

            v += a * dt;
            currentDistance += v * dt;
            time += dt;

            speeds.push(v * 3.6); // Convert m/s to km/h
            times.push(time);
            distances.push(currentDistance);
        }
    }

    return { speeds, times, distances };
}