class Bullet
{
    constructor(x, y) {
	this.x = x;
	this.y = y;
	this.v_x = 4;
	this.v_y = 0;
    }
    update() {
	this.x += this.v_x;
	this.y += this.v_y;
    }
    draw(ctx) {
	ctx.fillStyle = "#444444";
	ctx.fillRect(this.x, this.y, 10, 10);
    }
}
