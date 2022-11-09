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
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (obj instanceof EnemyUFO || obj instanceof Projectile && obj.whoFired != this) {
            playAudio(Sound.bigexplosion);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }, keyboard) {
        if (keyboard.get(GameSettings.keyPress.right) && this.box.x + this.box.w < SCREEN_WIDTH)
            this.v_x = Player.SPEED;
        else if (keyboard.get(GameSettings.keyPress.left) && this.box.x > 0)
            this.v_x = -Player.SPEED;
        else
            this.v_x = 0;

        if (keyboard.get(GameSettings.keyPress.up) && this.box.y > 0)
            this.v_y = -Player.SPEED;
        else if (keyboard.get(GameSettings.keyPress.down) && this.box.y + this.box.h < SCREEN_HEIGHT)
            this.v_y = Player.SPEED;
        else
            this.v_y = 0;
        this.box.move(this.v_x * dt, this.v_y * dt);

        if (keyboard.get(GameSettings.keyPress.space))
            if (this.cd == 0) {
                spawn(new DefaultProjectile(this, this.box.x + this.box.w, this.box.y + this.box.h, 8, 0));
                playAudio(Sound.shot);
                this.cd = this.max_cd;
            }
        if (this.cd > 0)
            this.cd = Math.max(this.cd - 1 * dt, 0);
    }
}