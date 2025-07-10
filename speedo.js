let elements = {};

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state) {
    elements.engineValue.innerText = onOrOff(state);
}

function setSpeed(speedValue) {
    elements.speedValue.innerText = `${Math.round(speedValue * 2.236936)}`;
}

function setGear(gearValue) {
    elements.gearValue.innerText = String(gearValue);
}

function setRPM(rpmValue) {
    const arc = elements.rpmPath;
    const centerX = 100; // SVG viewBox center
    const centerY = 100;
    const radius = 85;

    const minAngle = 0;     // start at 0 degrees
    const maxAngle = 270;   // end at 270 degrees

    const angle = minAngle + (rpmValue * (maxAngle - minAngle));
    const arcPath = describeArc(centerX, centerY, radius, minAngle, angle);

    arc.setAttribute("d", arcPath);
}

// === Helper: Convert polar to Cartesian coordinates (for SVG arc) ===
function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

function createTicks() {
    const ticksContainer = document.querySelector('.ticks');
    const tickCount = 10;
    for (let i = 0; i < tickCount; i++) {
        const tick = document.createElement('div');
        tick.className = 'tick';
        const angle = (i / (tickCount - 1)) * 270 - 135;
        tick.style.transform = `rotate(${angle}deg) translateY(-85px)`;
        ticksContainer.appendChild(tick);
    }
}

function createCircularNumbers() {
    const container = document.querySelector('.circular-number');
    const count = 10;
    const radius = 102;
    const centerX = 150;
    const centerY = 150;

    for (let i = 0; i < count; i++) {
        const angle = (i / (count - 1)) * 270 + 90;
        const rad = angle * (Math.PI / 180);
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);

        const num = document.createElement('span');
        num.className = 'number';
        num.textContent = i;
        num.style.left = `${x}px`;
        num.style.top = `${y}px`;

        container.appendChild(num);
    }
}

createTicks();
createCircularNumbers();

// === Optional: Local testing ===
// document.addEventListener("DOMContentLoaded", () => {
//     elements = {
//         engineValue: document.getElementById('engineValue'),
//         speedValue: document.getElementById('speedValue'),
//         gearValue: document.getElementById('gearValue'),
//         rpmPath: document.getElementById('rpmPath')
//     };
// });

document.addEventListener("DOMContentLoaded", () => {
    elements = {
        engineValue: document.getElementById('engineValue'),
        speedValue: document.getElementById('speedValue'),
        gearValue: document.getElementById('gearValue'),
        rpmPath: document.getElementById('rpmPath')
    };

    // setInterval(() => {
    //     const randomSpeed = Math.random() * 50; // 0 to 50 m/s
    //     const randomGear = Math.floor(Math.random() * 7); // 0 to 6
    //     const randomRPM = Math.random(); // Value between 0.5 and 1.0
    //     const engineOn = Math.random() > 0.5; // true or false

    //     setSpeed(randomSpeed);
    //     setGear(randomGear);
    //     setRPM(randomRPM);
    //     setEngine(engineOn);
    // }, 1000);
});

