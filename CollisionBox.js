'use strict';

class CollisionBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    testCol(anotherBox) {
        return this.x <= anotherBox.x + anotherBox.w && this.x + this.w >= anotherBox.x && this.y <= anotherBox.y + anotherBox.h && this.y + this.h >= anotherBox.y;
    }

    draw(ctx) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}