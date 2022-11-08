
class Sprite {
    constructor(assetName, x, y) {
        this.x = x;
        this.y = y;
        this.pic = GameManager.assets[assetName];
    }
    draw(ctx) {
        ctx.drawImage(this.pic, this.x, this.y);
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    generateCol() {
        return new CollisionBox(this.x, this.y, this.pic.width, this.pic.height);
    }
}