'use strict';

const SCREEN_WIDTH = 2000, SCREEN_HEIGHT = 1000;

const Texture = {
    player: 'playerShip',
    defProjectile: 'bullet',
    smolProjectile: 'projsmall',
    ufo: 'ufo'
};

const Sound = {
    explosion: 'explosion-small',
    bigexplosion: 'explosion-big',
    shot: 'shot-1',
    enemyshot: 'laser small'
};

const GameSettings = {
    keyPress: {
        left: "KeyA",
        right: "KeyD",
        up: "KeyW",
        down: "KeyS",
        space: "Space",
        enter: "Enter"
    },
    debug: false
}
