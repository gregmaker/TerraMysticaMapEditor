'use strict'

/***********************************************************
/
/ hex-map.js
/
/**********************************************************/

class HexMap {
    // Start with board as all generic lands
    constructor() {
        this.height = BOARD_HEIGHT;
        this.width = BOARD_WIDTH;
        this.state = new Array(this.height * this.width);
    }

    // Convert 1D to 2D coordinates 
    conv1Dto2D(i) {
        let x = i % this.width;
        let y = Math.floor(i/this.width);
        return [x,y];
    }

    // Convert 2D to 1D coordinates
    conv2Dto1D(xy) {
        return xy[0] + xy[1]*this.width;
    }

    // Get the value of a hex
    get(xy) {
        if (Array.isArray(xy)) {
            return this.state[this.conv2Dto1D(xy)];
        }
        return this.state[xy];
    }


    // Check if index is out of bound
    outOfBounds(xy) {
        if (!Array.isArray(xy) ) {
            if (xy >= this.state.length) {return true;}
            if (this.get(xy) === oob.idx) {
                return true;
            }
            return false;
        }

        if (xy[1] > this.height-1) {return true};
        if (xy[1] < 0) {return true};
        if (xy[0] > this.width -1-xy[1]%2) {return true};
        if (xy[0] < 0) {return true};
        return false;
    }

    // get all inbounds neighboring hex
    // currently returns 9? 3*3 
    getNbs(xy) {
        let cand = [];
        // Row above / below shifted right if y is odd, left if even
        const shift = Math.pow(-1,(xy[1] % 2+1));
        cand.push([xy[0], xy[1]-1]);
        cand.push([xy[0], xy[1]+1]);
        cand.push([xy[0]+shift, xy[1]-1]);
        cand.push([xy[0]+shift, xy[1]+1]);
        cand.push([xy[0]-1, xy[1]]);
        cand.push([xy[0]+1, xy[1]]);
        // return in bound candidates.
        return cand.filter((hex) => !this.outOfBounds(hex));
    }

    // set a specific index val
    setHex(xy, val) {
        if (this.outOfBounds(xy)) { return; }
        const i = Array.isArray(xy) ? this.conv2Dto1D(xy) : xy;
        this.state[i] = val;
    }

    // set a new state
    setState(state) {
        this.state = state;
        this.publishBoard();
    }

    // get the max value of hexes
    getMax() {
        return Math.max(...this.state);
    }
}

