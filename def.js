'use strict';

const SCREEN_WIDTH = 2000, SCREEN_HEIGHT = 1000;

const Texture = {
    player: 'playerShip',
    defProjectile: 'bullet',
    pulseProjectile: 'blast',
    smolProjectile: 'projsmall',
    ufo: 'ufo',
    powerupPulse: 'pulsepowerup',
    powerupFast: 'fastpowerup'
};

const Sound = {
    explosion: 'explosion-small',
    bigexplosion: 'explosion-med',
    shot: 'shot-1',
    enemyshot: 'laser small',
    hit: 'dink',
    pulseshot: 'pulse',
    pickPowerup: 'bonus'
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
    gamepadMappings: {
        a: 0,
        horizontal: 0,
        vertical: 1
    },
    debug: false
}
