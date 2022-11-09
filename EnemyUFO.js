'use strict';

class EnemyUFO {
    static SPEED = 3;
    constructor(x, y) {
        this.v_x = -EnemyUFO.SPEED;
        this.v_y = 0;
        
        this.box = new CollisionBox(x, y, 80, 40);
        this.max_cd = 200;
        this.cd = 0;
        this.timer = 0;
    }

    hit(obj, perish) {
        if (obj instanceof Player || obj instanceof Projectile && obj.whoFired != this)
            perish();
    }

    update(dt, spawn) {
        this.v_y = Math.cos(this.timer / 100);
        this.box.move(this.v_x * dt, this.v_y * dt);
        if (this.cd == 0) {
            spawn(new Projectile(this, this.box.x, this.box.y + this.box.h, -4, 0));
            this.cd = this.max_cd;
        }
        if (this.cd > 0)
            this.cd = Math.max(this.cd - 1 * dt, 0);
        this.timer += 1 * dt;
    }
}