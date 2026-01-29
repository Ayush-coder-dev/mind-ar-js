const fs = require('fs');
let content = fs.readFileSync('c:/Users/Ayush/mind-ar-js/examples/app/hand-control.html', 'utf8');

// Add color picker style
const colorPickerStyle = `
        .color-picker {
            position: fixed;
            top: 50%;
            left: 16px;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 6px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .color-swatch {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid transparent;
            transition: all 0.15s ease;
        }
        .color-swatch.active {
            border-color: white;
            transform: scale(1.2);
            box-shadow: 0 0 15px currentColor;
        }
        .hand-cursor.picking {
            background: rgba(236, 72, 153, 0.6);
            width: 36px;
            height: 36px;
            box-shadow: 0 0 25px rgba(236, 72, 153, 0.9);
            border-color: #ec4899;
        }
        .ui-value.color {
            color: #ec4899;
        }
        .instructions .pink {
            color: #ec4899;
            font-weight: 600;
        }`;

content = content.replace('.control-btn.active {', colorPickerStyle + '\n\n        .control-btn.active {');

// Add color picker HTML before controls
const colorPickerHTML = `<div class="color-picker" id="colorPicker">
        <div class="color-swatch active" style="background: #a855f7;" data-color="purple"></div>
        <div class="color-swatch" style="background: #ef4444;" data-color="red"></div>
        <div class="color-swatch" style="background: #f97316;" data-color="orange"></div>
        <div class="color-swatch" style="background: #eab308;" data-color="yellow"></div>
        <div class="color-swatch" style="background: #22c55e;" data-color="green"></div>
        <div class="color-swatch" style="background: #06b6d4;" data-color="cyan"></div>
        <div class="color-swatch" style="background: #3b82f6;" data-color="blue"></div>
        <div class="color-swatch" style="background: #ec4899;" data-color="pink"></div>
    </div>

    `;

content = content.replace('<div class="controls">', colorPickerHTML + '<div class="controls">');

// Update instructions
content = content.replace(
    '<span class="green">Fist</span> → Save & rotate 3D | <span class="orange">Thumb+Ring</span> → Delete object',
    '<span class="green">Fist</span> → Save & rotate | <span class="orange">Thumb+Ring</span> → Delete | <span class="pink">Thumb+Pinky</span> → Color'
);

fs.writeFileSync('c:/Users/Ayush/mind-ar-js/examples/app/hand-control.html', content);
console.log('Added color picker UI');
