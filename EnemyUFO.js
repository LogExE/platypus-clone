'use strict';

class EnemyUFO {
    static SPEED = 3;
    constructor(x, y) {
        this.v_x = -EnemyUFO.SPEED;
        this.v_y = 0;
        this.sprite = new Sprite("ufo", x, y);
        this.box = this.sprite.generateCol();
        this.max_cd = 200;
        this.cd = 0;
        this.timer = 0;
    }

    draw(ctx) {
        if (GameManager.debug)
            this.box.draw(ctx);
        this.sprite.draw(ctx);
    }

    update(dt) {
        this.v_y = Math.cos(this.timer / 100);
        this.sprite.move(this.v_x * dt, this.v_y * dt);
        this.box.move(this.v_x * dt, this.v_y * dt);
        if (this.cd == 0) {
            this.fire();
            this.cd = this.max_cd;
        }
        if (this.cd > 0)
            this.cd = Math.max(this.cd - 1 * dt, 0);
        this.timer += 1 * dt;
    }

    fire() {
        GameManager.projectiles.push(new Projectile(this, "bullet", this.box.x, this.box.y + this.box.h, -4, 0));
    }
}