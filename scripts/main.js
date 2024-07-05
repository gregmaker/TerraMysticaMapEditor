'use strict'

/***********************************************************
/   main.js
/**********************************************************/

// Create the board state
const boardState = new BoardState;
const waterRandomizer = new WaterRandomizer;
const landRandomizer = new LandRandomizer;
const fileWorker = new FileWorker;

// Create the canvas element
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
ctx.font = "12px serif";
canvas.addEventListener('mousedown', 
    (evt) => getCursorPosition(canvas, evt));
canvas.width = Math.round(hexWidth * BOARD_WIDTH);
canvas.height = Math.round(hexY2 * BOARD_HEIGHT + hexY1);

// Reset Land Button
const resetLandButton = document.getElementById('resetLand');
resetLandButton.addEventListener('mousedown', 
    (evt) => boardState.resetLand());

// Reset Water Button
const resetAllButton = document.getElementById('resetAll');
resetAllButton.addEventListener('mousedown',
    (evt) => boardState.resetAll());

// Random Water Button
const runWaterButton = document.getElementById('runWater');
runWaterButton.addEventListener('mousedown', 
    (evt) => waterRandomizer.run());

// Random Land Button
const runLandButton = document.getElementById('runLand');
runLandButton.addEventListener('mousedown', 
    (evt) => landRandomizer.run());

// Load button
document.getElementById('file-input')
    .addEventListener('change', fileWorker.loadFile, false);

// Save Button
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('mousedown', () => saveFile());

// Strength Button
const strengthButton = document.getElementById('hexStrength');
strengthButton.addEventListener('mousedown', () => debugHexes());

// Rebalance button
const rebalanceButton = document.getElementById('rebalance');
rebalanceButton.addEventListener('mousedown', () => rebalance());

// Last selected hex label
const hexLabel = document.getElementById('hexLabel');
function updateHexLabel(xy) {
    let label = ColorWheel[boardState.get(xy)].name;
    hexLabel.innerText = ('Selected Hex Type: ' + label);
}

boardState.subscribeHex(updateHexLabel);
boardState.subscribeBoard(drawHexagons);
boardState.publishBoard();
