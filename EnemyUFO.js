'use strict';

class EnemyUFO {
    static SPEED = 3;
    static WIDTH = 120;
    static HEIGHT = 60;
    constructor(x, y) {
        this.v_x = -EnemyUFO.SPEED;
        this.v_y = 0;

        this.box = new CollisionBox(x, y, EnemyUFO.WIDTH, EnemyUFO.HEIGHT);
        this.max_cd = 200;
        this.cd = 0;
        this.timer = 0;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof Player || obj instanceof Projectile && obj.whoFired != this) {
            playAudio(Sound.explosion);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }) {
        this.v_y = Math.cos(this.timer / 100);
        this.box.x += this.v_x * dt
        this.box.y += this.v_y * dt;

        if (this.box.x + this.box.w < 0)
        {
            perish();
            return;
        }

        if (this.cd == 0) {
            spawn(new SmallProjectile(this, this.box.x, this.box.y + this.box.h, -4, 0));
            playAudio(Sound.enemyshot);
            this.cd = this.max_cd;
        }
        if (this.cd > 0)
            this.cd = Math.max(this.cd - 1 * dt, 0);
        this.timer += 1 * dt;
    }
}