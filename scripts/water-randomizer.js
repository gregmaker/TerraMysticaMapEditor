'use strict'

/***********************************************************
/   water-randomizer.js
/
/   Functionality for randomly assigning water hexes
/   Click multiple times for more water
/**********************************************************/

class WaterRandomizer {
    constructor() {
        this.numWater = 15; // TODO - set based on # of player
        this.height = BOARD_HEIGHT;
        this.width = BOARD_WIDTH;
        this.noiseValues = new Array(this.width * this.height).fill(0);
        this.threshold = 0;
    }

    conv2Dto1D(xy) {
        return boardState.conv2Dto1D(xy);
    }

    setWater() {
        this.noiseValues.forEach( (val, idx) => {
            if (val < this.threshold) {
                boardState.setHex(idx, water.idx);
            }
        });
    }

    run() {
        this.genNoise();
        this.setThreshold();
        this.setWater();
        boardState.publishBoard();
    }

    genNoise() {
        this.noiseValues.forEach( (val, idx) => {
            this.noiseValues[idx] = Math.random();
        });
    }

    setThreshold() {
        const sorted = [...this.noiseValues].sort();
        this.threshold = sorted[this.numWater + 1];
    }
}

