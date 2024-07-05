'use strict'

/***********************************************************
/ board-state.js
/
/  Functionality for updating game state
/
/  API -
/    constructor(h,w,val) - create board state w/ indicated val
/    resetLand() - return all land to unspecified
/    resetAll() - retun to initial state
/    setState([state]) - set board state to passed state
/    setHex(idx, val) - set board state at index to val
/    clickHex(idx, water) - a hex on the board was clicked
/    [state] = get() - retrieve the board state
/     
/    Public helper functions:
/    [x,y] = conv1d2d(i) - convert 1D coord to 2D
/    i = conv2d1d([x,y]) - convert 2d coord to 1D
/    n = countValue(color) - count the number of this color on map
/    b = outOfBounds([x,y]) - is the hex out of bonds
/    [[x0,y0]...[xN,yN]] = getNbs([x,y]) - returns list of all in bound neighbors
/    n = colorDist(color1, color2) - terraforming dist. between two colors
/***********************************************************/

class BoardState extends HexMap {
    // Start with board as all generic lands
    constructor() {
        super();
        this.boardSubscribers = [];
        this.hexSubscribers = [];
        this.resetAll();
    }

    // Reset board to all generic lands
    resetAll() {
        this.state.fill(land.idx);
        this.setOOB()
        this.publishBoard();
    }

    // Reset board but preserve water
    resetLand() {
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] !== water.idx && this.state[i] != oob.idx) {
                this.state[i] = land.idx;
            }
        }
        this.publishBoard();
    }

    setOOB() {
        for (let i=1; i<this.height; i+=2) {
            this.state[this.conv2Dto1D([this.width-1,i])] = oob.idx;
        }
    }

    // Count instances of all color
    countColored() {
        let cnt = 0;
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] < 7) {cnt++;}
        }
        return cnt;
    }

    // return closest instances of a color within dist of xy
    getNearestColor(color, xy) {
        let minDist = this.height*this.height + this.width*this.width;
        let xy1 = [];
        let dist = 0;
        let result = false;
        const start = this.conv2Dto1D(xy);
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] === color && i !== start) {
                xy1 = boardState.conv1Dto2D(i);
                dist = (xy[0] - xy1[0]) * (xy[0] - xy1[0]) + (xy[1] - xy1[1])*(xy[1] - xy1[1]);
                if (dist < minDist) {
                    minDist = dist;
                    result = xy1;
                }
            }
        }
        return result;
    }
        
    // get distance between two colors
    // Note: JS does negative % strange
    // Returns: [dig cost, cur ship, total ship]
    getDist(color1, color2, curShip, totalShip) {
        if (color2 === water.idx) {
            // next hex is water, increase shipping
            curShip = curShip + 1;
            if (curShip > totalShip) {
                totalShip = curShip;
            }
            if (totalShip > 3) {
                return [Infinity, Infinity, Infinity];
            }
            return [0, curShip, totalShip];
        }
        if (color1 > 6 || color2 > 6) {
            return [Infinity, Infinity, Infinity];
        }
        // Next hex is not water, reset curShip
        curShip = 0;
        let dir1 = ((((color1 - color2) % 7) + 7) % 7);
        let dir2 = ((((color2 - color1) % 7) + 7) % 7);
        return [Math.min(dir1, dir2), curShip, totalShip];
    }


    // click on a hex
    clickHex(xy, shiftClick) {
        if (!Array.isArray(xy)) {return; }
        if (this.outOfBounds(xy)) { return; }
        let i = this.conv2Dto1D(xy);
        if (shiftClick) {
            const val = document.getElementById("hexType").selectedIndex;
            this.state[i] = val;
            //console.log(val);
        } else {
            this.state[i] = (this.state[i]+1)%(ColorWheel.length-1);
        }
        this.publishHex(xy);
        this.publishBoard();
    }

    // subscribe to board change
    subscribeBoard(cb) {
        this.boardSubscribers.push(cb);
    }

    // Count instances of a color
    countValue(value) {
        let cnt = 0;
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] === value) {cnt++;}
        }
        return cnt;
    }

    // subscribe to hex change
    subscribeHex(cb) {
        this.hexSubscribers.push(cb);
    }
    
    publishBoard() {
        for (const cb of this.boardSubscribers) {
            cb();
        }
    }
    
    publishHex(xy) {
        for (const cb of this.hexSubscribers) {
            cb(xy);
        }
    }
}

