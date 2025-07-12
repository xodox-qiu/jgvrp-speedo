let elements = {};
let currentRPM = 0, rpmAnimationFrame;
let turnSignalState = 0;
let turnSignalBlinkInterval = null;
let blinkVisible = true;

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state) {
    elements.engineValue.innerText = onOrOff(state);
}

function setHeadlight(state) {
    switch(state)
    {
        case 1: elements.headlightValue.src = 'img/headlight-on.png'; break;
        case 2: elements.headlightValue.src = 'img/headlight-high.png'; break;
        default: elements.headlightValue.src = 'img/headlight-off.png';
    }
}

function setTurnSignal(state) {
    if (turnSignalBlinkInterval) {
        clearInterval(turnSignalBlinkInterval);
        turnSignalBlinkInterval = null;
    }

    turnSignalState = state;

    if (state !== 1 && state !== 2) {
        elements.turnsignalValue.src = 'img/turn-signal-off.png'; // or a default image if needed
        return;
    }

    const leftImage = 'img/turn-signal-left.png';
    const rightImage = 'img/turn-signal-right.png';

    elements.turnsignalValue.src = (state === 1) ? rightImage : leftImage;

    turnSignalBlinkInterval = setInterval(() => {
        blinkVisible = !blinkVisible;
        if (blinkVisible) {
            elements.turnsignalValue.src = (state === 1) ? rightImage : leftImage;
        } else {
            elements.turnsignalValue.src = 'img/turn-signal-off.png'; // Hide image (blink off)
        }
    }, 400); // Blink every 500ms
}

function setSpeed(speedValue) {
    elements.speedValue.innerText = `${Math.round(speedValue * 2.236936)}`;
}

function setGear(gearValue) {
    elements.gearValue.innerText = String(gearValue);
}

function setRPM(targetRPM) {
    cancelAnimationFrame(rpmAnimationFrame);

    const centerX = 100;
    const centerY = 100;
    const radius = 85;
    const minAngle = 0;
    const maxAngle = 270;
    const speed = 0.1;

    function animate() {
        const diff = targetRPM - currentRPM;

        if (Math.abs(diff) < 0.001) {
            currentRPM = targetRPM;
        } else {
            currentRPM += diff * speed;
        }

        const angle = minAngle + currentRPM * (maxAngle - minAngle);
        const arcPath = describeArc(centerX, centerY, radius, minAngle, angle);
        elements.rpmPath.setAttribute("d", arcPath);

        const tipLength = 2.5;
        const tipStart = angle - tipLength;
        const tipEnd = angle;
        const tipPath = describeArc(centerX, centerY, radius, tipStart, tipEnd);
        elements.rpmTip.setAttribute("d", tipPath);

        if (Math.abs(diff) >= 0.001) {
            rpmAnimationFrame = requestAnimationFrame(animate);
        }
    }

    animate();
}

function setEngineHealth(percent) {
    const centerX = 100;
    const centerY = 100;
    const radius = 90;

    const startAngle = 200;
    const sweepAngle = 80;
    const endAngle = startAngle + (sweepAngle * percent);

    const arc = describeArc(centerX, centerY, radius, startAngle, endAngle);
    document.getElementById("engine").setAttribute("d", arc);
}

function setfuelHealth(percent) {
    const centerX = 100;
    const centerY = 100;
    const radius = 90;

    const startAngle = 150;
    const sweepAngle = 80;
    const endAngle = startAngle + (sweepAngle * percent);

    const arc = describeArc(centerX, centerY, radius, startAngle, endAngle);
    document.getElementById("fuel").setAttribute("d", arc);
}

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

function setFuel(fuel) {
    elements.fuelHealth.innerText = `${(fuel * 100).toFixed(1)}%`; // optional
    setfuelHealth(fuel); // <- update the arc visually
}

function setHealth(health) {
    elements.engineHealth.innerText = `${(health * 100).toFixed(1)}%`; // optional
    setEngineHealth(health); // <- update the arc visually
}

document.addEventListener("DOMContentLoaded", () => {
    elements = {
    engineValue     : document.getElementById('engineValue'),
    speedValue      : document.getElementById('speedValue'),
    gearValue       : document.getElementById('gearValue'),
    rpmPath         : document.getElementById('rpmPath'),
    rpmTip          : document.getElementById('rpmTip'),
    rpmRedline      : document.getElementById('rpmRedline'),
    headlightValue  : document.getElementById('headlightValue'),
    turnsignalValue : document.getElementById('turnsignalValue'),
    fuelHealth      : document.getElementById('fuel'),
    engineHealth    : document.getElementById('engine')
};
        const redlineStart = 7.5 / 9;  // tick 8 out of 9 (normalized)
        const redlineEnd = 9 / 9;    // tick 9
        const fuelBgStart = 150;
        const fuelBgSweep = 80;
        const engineBgStart = 200;
        const engineBgSweep = 80;

        const centerX = 100;
        const centerY = 100;
        const radius = 85;
        const minAngle = 0;
        const maxAngle = 270;

        const redlineAngleStart = minAngle + redlineStart * (maxAngle - minAngle);
        const redlineAngleEnd = minAngle + redlineEnd * (maxAngle - minAngle);
        const fuelBgPath = describeArc(100, 100, 90, fuelBgStart, fuelBgStart + fuelBgSweep);
        const engineBgPath = describeArc(100, 100, 90, engineBgStart, engineBgStart + engineBgSweep);

        const redlinePath = describeArc(centerX, centerY, radius, redlineAngleStart, redlineAngleEnd);
        document.getElementById('rpmRedline').setAttribute('d', redlinePath);
        document.getElementById("fuelHealthBg").setAttribute("d", fuelBgPath);
        document.getElementById("engineHealthBg").setAttribute("d", engineBgPath);
    
    // setInterval(() => {
    //     const randomSpeed = Math.random() * 50; // 0 to 50 m/s
    //     const randomGear = Math.floor(Math.random() * 7); // 0 to 6
    //     const randomRPM = Math.random(); // Value between 0.5 and 1.0
    //     const engineOn = Math.random() > 0.5; // true or false
    //     const randomState = Math.floor(Math.random() * 3); // 0, 1, or 2
    //     const randomSignal = Math.floor(Math.random() * 3); // 0, 1, or 2
    //     const randomEngine = Math.random(); // e.g., 0.75 for 75% health
    //     const randomfuel = Math.random();   // e.g., 0.45 for 45% fuel

    //     setEngineHealth(randomEngine);
    //     setfuelHealth(randomfuel);
    //     setTurnSignal(1);
    //     setSpeed(randomSpeed);
    //     setGear(randomGear);
    //     setRPM(randomRPM);
    //     setEngine(engineOn);
    //     setHeadlight(randomState);
    // }, 1000);
});

