'use strict';

class Player {
    constructor(x, y) {
        this.v_x = 0;
        this.v_y = 0;
        this.sprite = new Sprite("playerShip", x, y);
        this.box = this.sprite.generateCol();
        this.max_cd = 20;
        this.cd = 0;
    }

    draw(ctx) {
        if (GameManager.debug)
            this.box.draw(ctx);
        this.sprite.draw(ctx);
    }

    update(dt) {
        if (GameManager.keyboard.get(GameSettings.keyPress.right))
            this.v_x = 2;
        else if (GameManager.keyboard.get(GameSettings.keyPress.left))
            this.v_x = -2;
        else
            this.v_x = 0;

        if (GameManager.keyboard.get(GameSettings.keyPress.up))
            this.v_y = -2;
        else if (GameManager.keyboard.get(GameSettings.keyPress.down))
            this.v_y = 2;
        else
            this.v_y = 0;

        this.sprite.move(this.v_x * dt, this.v_y * dt);
        this.box.move(this.v_x * dt, this.v_y * dt);
        if (GameManager.keyboard.get(GameSettings.keyPress.space))
            if (this.cd == 0) {
                this.fire();
                this.cd = this.max_cd;
            }
        if (this.cd > 0)
            --this.cd;
    }

    fire() {
        GameManager.objects.push(new Projectile("bullet", this.box.x + this.box.w, this.box.y + this.box.h, 8, 0));
    }
}