'use strict';

class Projectile {
    constructor(whoFired, x, y, v_x, v_y) {
        this.v_x = v_x;
        this.v_y = v_y;
        this.whoFired = whoFired;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (!(obj instanceof Projectile) && this.whoFired != obj) {
            playAudio(Sound.explosion);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }) {
        this.box.move(this.v_x * dt, this.v_y * dt);
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