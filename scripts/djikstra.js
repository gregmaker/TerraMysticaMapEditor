'use strict'

/***********************************************************
/
/ djikstra.js
/
/**********************************************************/
class Djikstra extends HexMap {
    constructor() {
        super();
        this.resetAll();
    }

    resetAll() {
        this.state.fill(Infinity);
    };

    genMap(xy, color1, maxValue) {
        // Reset all to infinity
        this.resetAll();
        // Set xy to zero
        this.setHex(xy, 0);
        this.step(xy, color1, 0, maxValue, 0, 0, 0);
        
    }

    step(xy, color1, totalDig, maxWork, curShip, pathShip) {
        const nbs = this.getNbs(xy);
        for (const nb of nbs ) {
            let workRequired, totalWork, digRequired, curShipUsed, totalShipUsed;
            workRequired = boardState.getDist(color1, boardState.get(nb), curShip, pathShip);
            digRequired = workRequired[0];
            curShipUsed = workRequired[1];
            totalShipUsed = workRequired[2];
            totalWork = totalDig + totalShipUsed + digRequired;
            if (totalWork < maxWork && totalWork < this.get(nb) && totalShipUsed <= 3) {
                this.setHex(nb, totalWork);
                this.step(nb, color1, totalDig + digRequired, maxWork, curShipUsed, totalShipUsed);
            }
        }
    }

    // Count instances of a value, so long as its not water
    countValue(value) {
        let cnt = 0;
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] === value && boardState.get(i) !== water.idx) {
                cnt++;
            }
        }
        return cnt;
    }
    
    clearHexagons() {
        boardState.publishBoard();
    }

    labelHexagons() {
        let odd, x, y, text;
        for (let r=0; r<BOARD_HEIGHT; r++) {
            odd = r % 2;
            for (let c=0; c<BOARD_WIDTH; c++) {
                x = (odd+1)*hexX + c*hexWidth-hexWidth/4;
                y = r*hexY2 + hexY3/2;
                text = this.state[this.conv2Dto1D([c,r])];
                labelHexagon(x,y,text);
            }
        }
    }

    countOnes() {
        let odd, x, y, text;
        let max = 0;
        let color;
        for (let r=0; r<BOARD_HEIGHT; r++) {
            odd = r%2;
            for (let c=0; c<BOARD_WIDTH; c++) {
                x = (odd+1)*hexX + c*hexWidth-hexWidth/4;
                y = r*hexY2 + hexY3/2;
                color = boardState.get([c,r]);
                if (color !== water.idx) {
                    this.genMap([c,r], color, 2);
                    text = this.countValue(1)+this.countValue(0);
                    if (text > max) {
                        max = text;
                    }
                    labelHexagon(x,y,text);
                }
            }
        }
        return max;
    }

    resetVal(max, newVal) {
        let odd, color;
        for (let r=0; r<BOARD_HEIGHT; r++) {
            odd = r%2;
            for (let c=0; c<BOARD_WIDTH; c++) {
                color = boardState.get([c,r]);
                if (color !== water.idx) {
                    this.genMap([c,r], color, 2);
                    let val = this.countValue(1)+this.countValue(0);
                    if (max - val <= 2) {
                        boardState.setHex([c,r], newVal);
                    }
                }
            }
        }
    }


}

