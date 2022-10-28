class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.v_x = 0;
        this.v_y = 0;
	this.pic = GameManager.assets["playerShip"];
	this.width = this.pic.width;
	this.height = this.pic.height;
	this.max_cd = 10;
	this.cd = 0;
    }
    fire() {
	GameManager.objects.push(new Bullet(this.x + this.width, this.y + this.height));
    }
    update() {
        if (GameManager.keyboard.get(GameSettings.keyPress.right))
            this.v_x = 2;
        else if (GameManager.keyboard.get(GameSettings.keyPress.left))
            this.v_x = -2;
        else this.v_x = 0;
        if (GameManager.keyboard.get(GameSettings.keyPress.up))
            this.v_y = -2;
        else if (GameManager.keyboard.get(GameSettings.keyPress.down))
            this.v_y = 2;
        else this.v_y = 0;
        this.x += this.v_x;
        this.y += this.v_y;
	if (GameManager.keyboard.get(GameSettings.keyPress.space))
	    if (this.cd == 0) {
		this.fire();
		this.cd = this.max_cd;
	    }
	if (this.cd > 0)
	    --this.cd;
	
    }
    draw(ctx) {
        ctx.drawImage(this.pic, this.x, this.y);
    }
}
