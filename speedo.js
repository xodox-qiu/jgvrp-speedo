// === Element References ===
const speedDisplay = document.getElementById("speedValue");
const gearDisplay = document.getElementById("gearValue");
const rpmPath = document.getElementById("rpmPath");

// === Speed Display ===
function updateSpeed(speedMps) {
    const mph = speedMps * 2.236936;
    speedDisplay.innerText = `${Math.round(mph)} MPH`;
}

// === Gear Display ===
function updateGear(gear) {
    gearDisplay.innerText = gear === 0 ? 'N' : gear;
}

// === RPM Arc Drawing ===
function updateRPM(rpm) {
    const clamped = Math.min(Math.max(rpm, 0), 1); // Clamp between 0–1
    const startAngle = -90; // left side of circle
    const endAngle = startAngle + (clamped * 180); // fill half-circle

    const start = polarToCartesian(100, 100, 90, endAngle);
    const end = polarToCartesian(100, 100, 90, startAngle);

    const largeArcFlag = clamped > 0.5 ? 1 : 0;

    const d = [
        "M", start.x, start.y,
        "A", 90, 90, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    rpmPath.setAttribute("d", d);
}

// === Helper: Convert polar to Cartesian coordinates (for SVG arc) ===
function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

// === RageMP Event Listener ===
if (typeof mp !== 'undefined') {
    mp.events.add("updateSpeedo", (speed, rpm, gear) => {
        updateSpeed(speed);
        updateRPM(rpm);
        updateGear(gear);
    });
}

// === Optional: Local testing ===
document.addEventListener("keydown", (e) => {
    if (e.key === "u") {
        updateSpeed(Math.random() * 35);   // Simulate speed (m/s)
        updateRPM(Math.random());          // Simulate RPM (0–1)
        updateGear(Math.floor(Math.random() * 6)); // Simulate gear
    }
});
