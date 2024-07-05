'use strict'

/***********************************************************
/   bga-file.js
/**********************************************************/

class FileWorker {
    constructor() {
        this.bgaToIdxMap = this.mapBgaToIdx();
        this.idxToBgaMap = this.mapIdxToBga();
    }

    loadFile(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            fileWorker.loadContents(contents);
        };
        reader.readAsText(file);
    }

    mapBgaToIdx() {
        let theMap = {};
        for (const color of ColorWheel) {
            theMap[color.BGA] = color.idx;
        }
        return theMap;
    }

    mapIdxToBga() {
        let theMap = {};
        for (const color of ColorWheel) {
            theMap[color.idx] = color.BGA;
        }
        return theMap;
    }

    loadContents(contents) {
        let i = 0;
        console.log(contents);
        for (const content of contents) {
            if (this.bgaToIdxMap[content] !== undefined) {
                boardState.setHex(i, this.bgaToIdxMap[content]);
                i++;
                if (boardState.get(i) === oob.idx) {
                    i++;
                }
            }
        }
        boardState.publishBoard();
   }

   createContent() {
       let val, odd;
       let contents = '';
       let lastCol;
       for (let r=0; r<BOARD_HEIGHT; r++) {
           lastCol = BOARD_WIDTH - r%2;
           for (let c=0; c<lastCol; c++) {
               val = boardState.get([c,r]);
               if (this.idxToBgaMap[val] !== null) {
                   contents = contents.concat(this.idxToBgaMap[val]);
                   if (c !== lastCol -1) {
                       contents = contents.concat(',');
                   }
               }
           }
           if (r !== BOARD_HEIGHT-1) {
               contents = contents.concat('\n');
           }
       }
       console.log(contents);
       return contents;

   }

}

