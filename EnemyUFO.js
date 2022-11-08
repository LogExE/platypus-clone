'use strict';

class EnemyUFO {
    constructor(x, y) {
        this.v_x = -2;
        this.v_y = 0;
        this.sprite = new Sprite("ufo", x, y);
        this.box = this.sprite.generateCol();
        this.max_cd = 250;
        this.cd = 0;
        this.timer = 0;
    }

    draw(ctx) {
        if (GameManager.debug)
            this.box.draw(ctx);
        this.sprite.draw(ctx);
    }

    update() {
        this.v_y = Math.cos(this.timer / 100);
        this.sprite.move(this.v_x * dt, this.v_y * dt);
        this.box.move(this.v_x * dt, this.v_y * dt);
        if (this.cd == 0) {
            this.fire();
            this.cd = this.max_cd;
        }
        if (this.cd > 0)
            --this.cd;
        ++this.timer;
    }

    fire() {
        GameManager.objects.push(new Projectile("bullet", this.box.x, this.box.y + this.box.h, -4, 0));
    }
}