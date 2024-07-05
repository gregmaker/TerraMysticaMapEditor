'use strict'

const BOARD_WIDTH = 13;
const BOARD_HEIGHT = 9;

const plain     = {idx:0, name:'Plain', color:'Brown', BGA:'U'};
const swamp     = {idx:1, name: 'Swamp', color:'Black', BGA:'K'};
const lake      = {idx:2, name: 'Lake', color:'Blue', BGA:'B'};
const forest    = {idx:3, name: 'Forest', color:'Green', BGA:'G'};
const mountain  = {idx:4, name: 'Mountain', color:'Gray', BGA:'S'};
const wasteland = {idx:5, name: 'Wasteland', color:'Red', BGA:'R'};
const desert    = {idx:6, name: 'Desert', color:'Yellow', BGA:'Y'};
const land      = {idx:7, name: 'Land', color:'OldLace', BGA:null};
const water     = {idx:8, name: 'Water', color:'DarkSlateBlue', BGA:'I'};
const oob       = {idx:9, name: 'Out of bounds', color:'White', BGA:null};

const ColorWheel = [
    plain,
    swamp,
    lake,
    forest,
    mountain,
    wasteland,
    desert,
    land,
    water,
    oob,
];
