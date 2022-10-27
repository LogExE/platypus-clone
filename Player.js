class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.v_x = 0;
        this.v_y = 0;
    }
    fire() {

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
    }
    draw(ctx) {
        ctx.drawImage(GameManager.assets["playerShip"], this.x, this.y);
    }
}