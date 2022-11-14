'use strict';

class Projectile {
    constructor(whoFired, x, y, v_x, v_y) {
        this.v_x = v_x;
        this.v_y = v_y;
        this.active = true;

        this.whoFired = whoFired;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof Powerup && !obj.switching && this.whoFired instanceof Player) {
            obj.switchBonus();
            playAudio(Sound.hit);
            perish();
        }
        if (obj instanceof PulseProjectile || obj instanceof Player && !(this.whoFired instanceof Player)) {
            playAudio(Sound.hit);
            perish();
        }
        else if (!(obj instanceof Powerup) && !(obj instanceof Projectile) && !(obj instanceof Player) && this.whoFired instanceof Player) {
            if (this.whoFired.score !== undefined)
                this.whoFired.score += 10;
            playAudio(Sound.hit);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }) {
        this.box.x += this.v_x * dt
        this.box.y += this.v_y * dt;
        if (this.box.x + this.box.h < 0 || this.box.x > SCREEN_WIDTH || this.box.y + this.box.h < 0 || this.box.y > SCREEN_HEIGHT)
            perish();
    }
}

class SmallProjectile extends Projectile {
    constructor(whoFired, x, y, v_x, v_y) {
        super(whoFired, x, y, v_x, v_y)
        this.box = new CollisionBox(x, y, 30, 30);
    }
}

class DefaultProjectile extends Projectile {
    constructor(whoFired, x, y, v_x, v_y) {
        super(whoFired, x, y, v_x, v_y)
        this.box = new CollisionBox(x, y, 60, 30);
    }
}

class FastProjectile extends DefaultProjectile {
}

class PulseProjectile extends Projectile {
    static LIFETIME = 0.5;
    static GROWTH = 800;
    constructor(whoFired, x, y, v_x, v_y) {
        super(whoFired, x, y, v_x, v_y)
        this.box = new CollisionBox(x, y, 30, 40);
        this.timer = 0;
    }
    update(dt, { perish, spawn, playAudio }) {
        super.update(dt, { perish, spawn, playAudio });
        if (this.timer >= PulseProjectile.LIFETIME)
            perish();
        this.timer += dt;
        this.box.h += PulseProjectile.GROWTH * dt;
        this.box.y -= PulseProjectile.GROWTH / 2 * dt;
    }
}
