let elements = {};

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state) {
    elements.engineValue.innerText = onOrOff(state);
}

function updateSpeed(speedValue) {
    elements.speedValue.innerText = `${Math.round(speedValue * 2.236936)} MPH`;
}

function updateGear(gearValue) {
    elements.gearValue.innerText = String(gearValue);
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

    elements.rpmPath.setAttribute("d", d);
}

// === Helper: Convert polar to Cartesian coordinates (for SVG arc) ===
function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

// === Optional: Local testing ===
document.addEventListener("DOMContentLoaded", () => {
    elements = {
        engineValue: document.getElementById('engineValue'),
        speedValue: document.getElementById('speedValue'),
        gearValue: document.getElementById('gearValue'),
        rpmPath: document.getElementById('rpmPath')
    };
});
