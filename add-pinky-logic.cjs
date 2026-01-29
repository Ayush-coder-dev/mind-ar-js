const fs = require('fs');
let content = fs.readFileSync('c:/Users/Ayush/mind-ar-js/examples/app/hand-control.html', 'utf8');

// 1. Add detectPinkyPinch function after detectRingPinch
content = content.replace(
    `function detectRingPinch(lm) {
            const dx = lm[4].x - lm[16].x, dy = lm[4].y - lm[16].y;
            return Math.sqrt(dx * dx + dy * dy) < PINCH_THRESHOLD;
        }`,
    `function detectRingPinch(lm) {
            const dx = lm[4].x - lm[16].x, dy = lm[4].y - lm[16].y;
            return Math.sqrt(dx * dx + dy * dy) < PINCH_THRESHOLD;
        }

        function detectPinkyPinch(lm) {
            const dx = lm[4].x - lm[20].x, dy = lm[4].y - lm[20].y;
            return Math.sqrt(dx * dx + dy * dy) < PINCH_THRESHOLD;
        }`
);

// 2. Add pinkyFrames and colorIndex variables
content = content.replace(
    `let drawFrames = 0, eraseFrames = 0, fistFrames = 0, deleteFrames = 0;`,
    `let drawFrames = 0, eraseFrames = 0, fistFrames = 0, deleteFrames = 0, pinkyFrames = 0;
        let colorIndex = 0;
        let canChangeColor = true;
        const colorPalette = ['#a855f7', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#ec4899'];
        const colorNames = ['purple', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'pink'];`
);

// 3. Add pinkyPinch detection in onResults
content = content.replace(
    `const indexPinch = detectIndexPinch(lm);
                const middlePinch = detectMiddlePinch(lm);
                const ringPinch = detectRingPinch(lm);
                const fist = detectFist(lm);`,
    `const indexPinch = detectIndexPinch(lm);
                const middlePinch = detectMiddlePinch(lm);
                const ringPinch = detectRingPinch(lm);
                const pinkyPinch = detectPinkyPinch(lm);
                const fist = detectFist(lm);`
);

// 4. Add pinky pinch frame counting
content = content.replace(
    `if (indexPinch && !middlePinch && !ringPinch && !fist) { drawFrames++; eraseFrames = fistFrames = deleteFrames = 0; }
                else if (middlePinch && !indexPinch && !ringPinch && !fist) { eraseFrames++; drawFrames = fistFrames = deleteFrames = 0; }
                else if (ringPinch && !indexPinch && !middlePinch && !fist) { deleteFrames++; drawFrames = eraseFrames = fistFrames = 0; }
                else if (fist) { fistFrames++; drawFrames = eraseFrames = deleteFrames = 0; }
                else { drawFrames = eraseFrames = fistFrames = deleteFrames = 0; }`,
    `if (indexPinch && !middlePinch && !ringPinch && !pinkyPinch && !fist) { drawFrames++; eraseFrames = fistFrames = deleteFrames = pinkyFrames = 0; }
                else if (middlePinch && !indexPinch && !ringPinch && !pinkyPinch && !fist) { eraseFrames++; drawFrames = fistFrames = deleteFrames = pinkyFrames = 0; }
                else if (ringPinch && !indexPinch && !middlePinch && !pinkyPinch && !fist) { deleteFrames++; drawFrames = eraseFrames = fistFrames = pinkyFrames = 0; }
                else if (pinkyPinch && !indexPinch && !middlePinch && !ringPinch && !fist) { pinkyFrames++; drawFrames = eraseFrames = fistFrames = deleteFrames = 0; }
                else if (fist) { fistFrames++; drawFrames = eraseFrames = deleteFrames = pinkyFrames = 0; }
                else { drawFrames = eraseFrames = fistFrames = deleteFrames = pinkyFrames = 0; canChangeColor = true; }`
);

// 5. Add confirmed pinky check
content = content.replace(
    `const confirmedDraw = drawFrames >= PINCH_HOLD_FRAMES;
                const confirmedErase = eraseFrames >= PINCH_HOLD_FRAMES;
                const confirmedDelete = deleteFrames >= PINCH_HOLD_FRAMES;
                const confirmedFist = fistFrames >= FIST_HOLD_FRAMES;`,
    `const confirmedDraw = drawFrames >= PINCH_HOLD_FRAMES;
                const confirmedErase = eraseFrames >= PINCH_HOLD_FRAMES;
                const confirmedDelete = deleteFrames >= PINCH_HOLD_FRAMES;
                const confirmedPinky = pinkyFrames >= PINCH_HOLD_FRAMES;
                const confirmedFist = fistFrames >= FIST_HOLD_FRAMES;`
);

// 6. Add color change action before confirmedDelete handling  
content = content.replace(
    `} else if (confirmedDelete) {
                    if (currentMode !== 'delete') {
                        deleteNearestObject();
                    }
                    currentMode = 'delete';
                    handCursor.className = 'hand-cursor deleting';
                    modeValue.textContent = 'DELETE OBJ'; modeValue.className = 'ui-value delete';
                    isFistActive = false;
                } else if (confirmedFist) {`,
    `} else if (confirmedPinky) {
                    if (canChangeColor) {
                        colorIndex = (colorIndex + 1) % colorPalette.length;
                        updateCubeColor(colorPalette[colorIndex]);
                        updateColorPicker(colorIndex);
                        canChangeColor = false;
                    }
                    currentMode = 'color';
                    handCursor.className = 'hand-cursor picking';
                    modeValue.textContent = 'COLOR'; modeValue.className = 'ui-value color';
                    isFistActive = false;
                } else if (confirmedDelete) {
                    if (currentMode !== 'delete') {
                        deleteNearestObject();
                    }
                    currentMode = 'delete';
                    handCursor.className = 'hand-cursor deleting';
                    modeValue.textContent = 'DELETE OBJ'; modeValue.className = 'ui-value delete';
                    isFistActive = false;
                } else if (confirmedFist) {`
);

// 7. Add helper functions for color change after clearAll function
content = content.replace(
    `function saveCurrentShape() {`,
    `function updateCubeColor(color) {
            // Update CSS custom properties for grid-cube colors
            const style = document.documentElement.style;
            style.setProperty('--cube-main', color);
            
            // Apply to all existing grid cubes
            document.querySelectorAll('.grid-cube .front').forEach(el => {
                el.style.background = 'linear-gradient(135deg, ' + color + ', ' + adjustBrightness(color, -30) + ')';
            });
            document.querySelectorAll('.grid-cube .top').forEach(el => {
                el.style.background = 'linear-gradient(135deg, ' + adjustBrightness(color, 30) + ', ' + color + ')';
            });
            document.querySelectorAll('.grid-cube .back, .grid-cube .bottom').forEach(el => {
                el.style.background = adjustBrightness(color, -50);
            });
            document.querySelectorAll('.grid-cube .left, .grid-cube .right').forEach(el => {
                el.style.background = adjustBrightness(color, -20);
            });
        }

        function adjustBrightness(hex, percent) {
            const num = parseInt(hex.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.max(0, Math.min(255, (num >> 16) + amt));
            const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
            const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
            return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
        }

        function updateColorPicker(index) {
            document.querySelectorAll('.color-swatch').forEach((el, i) => {
                el.classList.toggle('active', i === index);
            });
        }

        function saveCurrentShape() {`
);

fs.writeFileSync('c:/Users/Ayush/mind-ar-js/examples/app/hand-control.html', content);
console.log('Added pinky pinch color cycling feature!');
