'use strict';

class Player {
    static SPEED = 4;
    constructor(x, y) {
        this.v_x = 0;
        this.v_y = 0;
        this.box = new CollisionBox(x, y, 100, 70);
        this.max_cd = 20;
        this.cd = 0;
    }

    hit(obj, perish) {
        if (obj instanceof EnemyUFO || obj instanceof Projectile && obj.whoFired != this)
            perish();
    }

    update(dt, spawn, keyboard) {
        if (keyboard.get(GameSettings.keyPress.right))
            this.v_x = Player.SPEED;
        else if (keyboard.get(GameSettings.keyPress.left))
            this.v_x = -Player.SPEED;
        else
            this.v_x = 0;

        if (keyboard.get(GameSettings.keyPress.up))
            this.v_y = -Player.SPEED;
        else if (keyboard.get(GameSettings.keyPress.down))
            this.v_y = Player.SPEED;
        else
            this.v_y = 0;

        this.box.move(this.v_x * dt, this.v_y * dt);
        if (keyboard.get(GameSettings.keyPress.space))
            if (this.cd == 0) {
                spawn(new Projectile(this, this.box.x + this.box.w, this.box.y + this.box.h, 8, 0));
                this.cd = this.max_cd;
            }
        if (this.cd > 0)
            this.cd = Math.max(this.cd - 1 * dt, 0);
    }
}