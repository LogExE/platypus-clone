'use strict';

class Projectile {
    constructor(whoFired, assetName, x, y, v_x, v_y) {
        this.sprite = new Sprite(assetName, x, y);
        this.box = this.sprite.generateCol();
        this.v_x = v_x;
        this.v_y = v_y;
        this.whoFired = whoFired;
    }
    update(dt) {
        this.sprite.move(this.v_x * dt, this.v_y * dt);
        this.box.move(this.v_x * dt, this.v_y * dt);
    }
    draw(ctx) {
        if (GameManager.debug)
            this.box.draw(ctx);
        this.sprite.draw(ctx);
    }
}
