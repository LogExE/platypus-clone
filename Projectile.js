'use strict';

class Projectile {
    constructor(whoFired, x, y, v_x, v_y) {
        this.box = new CollisionBox(x, y, 50, 30);
        this.v_x = v_x;
        this.v_y = v_y;
        this.whoFired = whoFired;
    }
    update(dt) {
        this.box.move(this.v_x * dt, this.v_y * dt);
    }

    hit(obj, perish) {
        if (obj != this.whoFired)
            perish();
    }
}
