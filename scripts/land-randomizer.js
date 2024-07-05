'use strict'

/***********************************************************
/   land-randomizer.js
/
/   Functionality for randomly assigning land hexes per DerlKM
/**********************************************************/
// See: https://www.youtube.com/watch?v=n3GLilmWAV0
// https://github.com/ikmMaierBTUCS/Terra-Mystica-Map-Generator/
// Full algorithm has not been implemented


function dot(a, b) {
    let c = [];
    for (let i = 0; i < a.length && i < b.length; i++ ) {
        c.push(a[i]*b[i]);
    }
    return c;
}

class LandRandomizer {

    constructor() {
        this.origState = [...boardState.state]; // deep copy
        this.djikstra = new Djikstra;
    }
    
    nextHex(xy) {
        // get the nearest undefined hex
        return boardState.getNearestColor(land.idx, xy); 
    }

    run() {
        let xy = [Math.round(boardState.width/2), Math.round(boardState.height/2)];
        let probability = [];
        while (boardState.countValue(land.idx) > 0) {
            xy = this.nextHex(xy);
            probability = this.calcProbability(xy);
            boardState.setHex(xy, this.pickColor(probability));
        }
        boardState.publishBoard();
    }

    calcProbability(xy) {
        let probability = [1,1,1,1,1,1,1];
        let hexCnt = [0,0,0,0,0,0,0];
        let avgHexPlaced = boardState.countColored()/7;
        let overrep;
        let probFromHexCnt;
        for (let i=0; i<probability.length; i++) {
            // Generate map of all hexes reachable with less
            // than 5 work
            this.djikstra.genMap(xy,ColorWheel[i].idx, 4);
            if (this.djikstra.countValue(0) > 1) {
                probability[i] = 0;
            } else {
                // How overrepresented the color is
                overrep = boardState.countValue(ColorWheel[i].idx) - avgHexPlaced;
                hexCnt[i] = overrep * 4
                            + this.djikstra.countValue(1) * 2 
                            + this.djikstra.countValue(2)/4
                            + this.djikstra.countValue(3)/8
                            + this.djikstra.countValue(4)/16;
            }
            
        }
        probFromHexCnt = this.convertHexCntToProb(hexCnt);
        probability = dot(probability, probFromHexCnt);
        probability = this.normalize(probability);
        return probability;
    }

    convertHexCntToProb(hexCnt) {
        // probability will be normalized later
        // also need to handle all zero case
        const max = hexCnt.reduce((max,val) => val > max ? val : max,0);
        if (max === 0 ) {
            return [1,1,1,1,1,1,1];
        }
        for (let i=0; i<hexCnt.length; i++) {
            hexCnt[i] = max - hexCnt[i] + 1;
        }
        return hexCnt;

    }
    
    normalize(probability) {
        const sum = probability.reduce((acc,val) => acc+val,0);
        return probability.map( (val) => val/sum);
    }

    pickColor(probality) {
        let randf = Math.random();
        let cumProb = 0;
        let idx = 0;
        for (const prob of probality) {
            cumProb += prob;
            if (randf <= cumProb) { return idx;}
            idx += 1;
        }
        return idx;
    }

}

