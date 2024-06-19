export function accelerationToPercentOfMaxSpeed(P, m, rho, Cd, A, g, rollingResistanceCoefficient, drivetrainLossFactor, percentGrade, windSpeed, dt, maxTheoreticalSpeed, percentOfMaxSpeed = 0.99) {
    let v = 0; // Initial velocity 
    let time = 0;
    const speeds = [];
    const times = [];

    while (time <= 600 && v < maxTheoreticalSpeed * percentOfMaxSpeed / 3.6) { // Run simulation for maximum of 600 seconds 
        const F_applied = P / Math.max(v, 0.1); // Avoid division by zero by using max
        const F_d = 0.5 * rho * Cd * A * Math.pow(v + windSpeed / 3.6, 2); // Include wind effect
        const F_rr = m * g * rollingResistanceCoefficient * Math.cos(Math.atan(percentGrade/100)); // Rolling resistance
        const F_drivetrain = F_applied * drivetrainLossFactor/100; // Drivetrain losses
        const F_grade = m * g * Math.sin(Math.atan(percentGrade / 100)); // Grade resistance
        const a = (F_applied - F_d - F_rr - F_drivetrain - F_grade) / m;

        v += a * dt;
        time += dt;

        // Track speeds and times for plotting
        speeds.push(v * 3.6); // Convert m/s to km/h
        times.push(time);
    }
    return { speeds, times };
}

export function calculateTheoreticalMaxSpeed(P, m, rho, Cd, A, g, rollingResistanceCoefficient, drivetrainLossFactor, percentGrade, windSpeed) {
    const tolerance = 0.001; // Tolerance for the numerical solution
    let v_min = 0; // Lower bound of the search interval (m/s)
    let v_max = 50; // Upper bound of the search interval (m/s), a reasonable upper bound for a bicycle
    let v_mid;

    function netForce(v) {
        const F_applied = P / Math.max(v, 0.1); // Applied force
        const F_d = 0.5 * rho * Cd * A * Math.pow(v + windSpeed/3.6, 2); // Drag force
        const F_rr = m * g * rollingResistanceCoefficient * Math.cos(Math.atan(percentGrade/100)); // Rolling resistance
        const F_drivetrain = F_applied * drivetrainLossFactor/100; // Drivetrain losses
        const F_grade = m * g * Math.sin(Math.atan(percentGrade/100)); // Grade resistance
        return F_applied - F_d - F_rr - F_drivetrain - F_grade; // Net force
    }

    // Perform bisection method to find the velocity where net force is zero
    while (v_max - v_min > tolerance) {
        v_mid = (v_min + v_max) / 2;
        if (netForce(v_mid) > 0) {
            v_min = v_mid;
        } else {
            v_max = v_mid;
        }
    }

    return v_mid * 3.6; // Convert m/s to km/h
}