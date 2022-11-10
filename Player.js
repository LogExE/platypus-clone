'use strict';

class Player {
    static SPEED = 4;
    static WIDTH = 150;
    static HEIGHT = 70;
    constructor(x, y) {
        this.v_x = 0;
        this.v_y = 0;
        this.box = new CollisionBox(x, y, Player.WIDTH, Player.HEIGHT);
        this.max_cd = 20;
        this.cd = 0;
        this.score = 0;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof EnemyUFO || obj instanceof Projectile && obj.whoFired != this) {
            playAudio(Sound.bigexplosion);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }, input) {
        this.v_x = input.get("horizontal") * Player.SPEED;
        this.v_y = input.get("vertical") * Player.SPEED;
        this.box.x = Math.max(0, Math.min(this.box.x + this.v_x * dt, SCREEN_WIDTH - this.box.w));
        this.box.y = Math.max(0, Math.min(this.box.y + this.v_y * dt, SCREEN_HEIGHT - this.box.h));

        if (input.get("space"))
            if (this.cd == 0) {
                spawn(new DefaultProjectile(this, this.box.x + this.box.w, this.box.y + this.box.h, 8, 0));
                playAudio(Sound.shot);
                this.cd = this.max_cd;
            }
        if (this.cd > 0)
            this.cd = Math.max(this.cd - 1 * dt, 0);
    }
}