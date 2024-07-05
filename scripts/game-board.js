'use strict'

/***********************************************************
/   game-board.js
/  
/   Functionality for:
/       - Displaying the board
/       - Determining what was clicked on canvas
/
/**********************************************************/

// Define the hexagon size
const HEX_WIDTH = 50;
const root3 = Math.sqrt(3);
const hexDiameter = 2*HEX_WIDTH/root3;
const hexX = HEX_WIDTH/2;
const hexY1 = Math.round(hexDiameter/4);
const hexY2 = Math.round(hexDiameter*3/4);
const hexY3 = Math.round(hexDiameter);
const hexHeight = hexY3;
const hexWidth = HEX_WIDTH;


// Convert click coordinates to canvas coordinates
function getCursorPosition(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const elementRelativeX = evt.clientX - rect.left;
    const elementRelativeY = evt.clientY - rect.top;
    const x = elementRelativeX * canvas.width / rect.width;
    const y = elementRelativeY * canvas.height / rect.height;
    let hex = whichHex([x,y]);
    //console.log("Hex: " + hex);
    if (hex) {
        boardState.clickHex(hex, evt.shiftKey);
    }
}

// Convert canvas coordinates to which hex
function whichHex(xy) {
    const origXY = xy;
    let hexXY = hexInThisCoord(origXY);
    if (hexXY) {
        return hexXY;
    }
    let rotXY = rotate30(origXY);
    hexXY = hexInThisCoord(rotXY[1], rotXY[0]);
    if (hexXY) {
        return hexFromUV(hexXY, 30);
    }
    return false;
}

// Check if hex is unambiguous in this coord
function hexInThisCoord(xy) {
    let modX = xy[0];
    let modY = xy[1];
    let y = 0;
    while (modY > hexHeight) {
        // row height is every 3/4 hex
        modY -= hexY2;
        y++;
    }
    // unambiguous if in main rectange
    if (modY >= hexY1 && modY <= hexY2) {
        // Odd rows are offset
        modX -= hexWidth/2 * (y%2);
        let x = Math.floor(modX/hexWidth);
        return [x, y];
    }
    return false;
}

function rotate30(xy) {
    // x' = x*costA - y*sinA
    // y' = x*sinA + y*cosA
    let x = xy[0]*root3/2-xy[1]/2;
    let y = xy[0]/2+xy[1]*root3/2;
    return [x,y];
}

function hexFromUV(UV, coord) {
    // TODO
    //console.log("UV: " + UV);
    return false;
}

function labelHexagon(x,y,text) {
    ctx.fillStyle='White';
    ctx.fillText(text,x,y);
}

function drawHexagon(x,y,c) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+hexX, y+hexY1);
    ctx.lineTo(x+hexX, y+hexY2);
    ctx.lineTo(x, y+hexY3);
    ctx.lineTo(x-hexX, y+hexY2);
    ctx.lineTo(x-hexX, y+hexY1);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
}

function drawHexagons() {
    let odd, x, y, color;
    for (let r=0; r<BOARD_HEIGHT; r++) {
        odd = r % 2;
        for (let c=0; c<BOARD_WIDTH; c++) {
            x = (odd+1)*hexX + c*hexWidth;
            y = r*hexY2;
            color = ColorWheel[boardState.get([c,r])].color;
            drawHexagon(x,y,color);
        }
   }
}

function debugHex(xy) {
    boardState.publishBoard();
    const color = boardState.get(xy);
    landRandomizer.djikstra.genMap(xy,color,5);
    landRandomizer.djikstra.labelHexagons();
    console.log("boardState.publishBoard() to clear...");
}

function debugHexes() {
    boardState.publishBoard();
    const max = landRandomizer.djikstra.countOnes();
    for (let i=0; i<7; i++) {
        console.log(ColorWheel[i].name + ": " + boardState.countValue(ColorWheel[i].idx));
    }
    console.log("************");
}

function rebalance() {
    // Determine strength of each board
    const max = landRandomizer.djikstra.countOnes();
    // Reset strongest and weakest hexes
    landRandomizer.djikstra.resetVal(max, land.idx);
    // Perform land randomization on just reset hexes
    landRandomizer.run();

}

function clear() {
    boardState.publishBoard();
}

function saveFile() {
    const filename = document.getElementById('filename').value;
    const text = fileWorker.createContent();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    element.click();
}

