'use strict';

class Powerup {
    static STATES = [FastProjectile, PulseProjectile];
    static SPEED = 250;
    static WIDTH = 100;
    static HEIGHT = 100;
    static SWITCH_TIME = 1;
    constructor(x, y) {
        this.state = 0;
        this.box = new CollisionBox(x, y, Powerup.WIDTH, Powerup.HEIGHT);
        this.timer = 0;
    }
    update(dt, { perish, spawn, playAudio }) {
        this.box.x -= Powerup.SPEED / 2 * dt;
        if (this.timer > 0) {
            this.box.x += Powerup.SPEED * dt;
            this.timer = Math.max(this.timer - dt, 0);
        }
    }
    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof Player) {
            obj.current_projectile = Powerup.STATES[this.state];
            obj.poweruptimer = 10;
            perish();
        }
        else if (this.timer == 0 && obj instanceof Projectile && obj.whoFired instanceof Player) {
            this.timer = Powerup.SWITCH_TIME;
            this.state = (this.state + 1) % Powerup.STATES.length;
        }
    }
}