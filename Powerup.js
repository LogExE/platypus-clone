'use strict';

class Powerup {
    static STATES = [FastProjectile, PulseProjectile];
    static SPEED = 100;
    static WIDTH = 100;
    static HEIGHT = 100;
    static SWITCH_TIME = 1;

    constructor(x, y) {
        this.state = 0;
        this.box = new CollisionBox(x, y, Powerup.WIDTH, Powerup.HEIGHT);
        this.timer = 0;
    }

    advanceState() {
        this.state = (this.state + 1) % Powerup.STATES.length;
    }

    update(dt, { perish, spawn, playAudio }) {
        this.box.x -= Powerup.SPEED * dt;
        if (this.timer > 0) {
            this.box.x += 2 * Powerup.SPEED * dt;
            this.timer = Math.max(this.timer - dt, 0);
        }
        if (this.box.x + this.box.h < 0 || this.box.x > SCREEN_WIDTH || this.box.y + this.box.h < 0 || this.box.y > SCREEN_HEIGHT)
            perish();
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof Player) {
            if (obj.current_projectile == Powerup.STATES[this.state])
                obj.poweruptimer += 10;
            else
                obj.poweruptimer = 10;
            obj.current_projectile = Powerup.STATES[this.state];
            playAudio(Sound.pickPowerup);
            perish();
        }
        else if (this.timer == 0 && obj instanceof Projectile && obj.whoFired instanceof Player) {
            this.advanceState();
        }
    }
}