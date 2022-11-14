'use strict';

class EnemyUFO {
    static SPEED = 300;
    static WIDTH = 120;
    static HEIGHT = 60;
    static COOLDOWN = 2;

    constructor(x, y) {
        this.v_x = -EnemyUFO.SPEED;
        this.v_y = 0;
        this.box = new CollisionBox(x, y, EnemyUFO.WIDTH, EnemyUFO.HEIGHT);

        this.canFire = true;
        this.timer = 0;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof Player || obj instanceof Projectile && obj.whoFired instanceof Player) {
            playAudio(Sound.explosion);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }) {
        this.v_y = 100 * Math.cos(this.timer * Math.PI / 2);
        this.box.x += this.v_x * dt;
        this.box.y += this.v_y * dt;

        if (this.box.x + this.box.w < 0) {
            perish();
            return;
        }

        if (this.canFire) {
            spawn(new SmallProjectile(this, this.box.x, this.box.y + this.box.h, this.v_x * 1.2, this.v_y * 0.5));
            playAudio(Sound.enemyshot);
            this.canFire = false;
            setTimeout(() => this.canFire = true, EnemyUFO.COOLDOWN * 1000);
        }

        this.timer += dt;
    }
}