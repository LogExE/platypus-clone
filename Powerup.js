'use strict';

class Powerup {
    static BONUSES = [FastProjectile, PulseProjectile];
    static SPEED = 100;
    static WIDTH = 100;
    static HEIGHT = 100;
    static SWITCH_TIME = 1;
    static ACTIVE_TIME = 10;

    constructor(x, y) {
        this.box = new CollisionBox(x, y, Powerup.WIDTH, Powerup.HEIGHT);
        this.active = true;

        this.bonus = 0;
        this.switching = false;
    }

    switchBonus() {
        this.switching = true;
        setTimeout(() => this.switching = false, Powerup.SWITCH_TIME * 1000);
        this.bonus = (this.bonus + 1) % Powerup.BONUSES.length;
    }

    curBonus() {
        return Powerup.BONUSES[this.bonus];
    }

    update(dt, { perish, spawn, playAudio }) {
        if (this.switching)
            this.box.x += Powerup.SPEED * dt;
        else
            this.box.x -= Powerup.SPEED * dt;

        if (this.box.x + this.box.h < 0 || this.box.x > SCREEN_WIDTH || this.box.y + this.box.h < 0 || this.box.y > SCREEN_HEIGHT)
            perish();
    }

    queue(plr) {
        plr.current_projectile = this.curBonus();
        if (plr.powerupTime == 0)
            setTimeout(function checkTime() {
                --plr.powerupTime;
                if (plr.powerupTime == 0)
                    plr.current_projectile = DefaultProjectile;
                else
                    setTimeout(checkTime, 1000);
            }, 1000);
        plr.powerupTime += Powerup.ACTIVE_TIME;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof Player) {
            this.queue(obj);
            playAudio(Sound.pickPowerup);
            perish();
        }
    }
}