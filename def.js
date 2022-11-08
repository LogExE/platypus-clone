'use strict';

const ImageFiles = [
    'playerShip',
    'bullet',
    'ufo'
];

const SoundFiles = [
    'explosion'
];

const GameSettings = {
    keyPress: {
        left: "KeyA",
        right: "KeyD",
        up: "KeyW",
        down: "KeyS",
        space: "Space",
        enter: "Enter"
    },
}

const GameManager = {
    assets: {},
    objects: [],
    projectiles: [],
    keyboard: new Map(),
    gameState: "menu",
    debug: false
};
