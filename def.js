const ImageFiles = [
    'playerShip'
];

const GameSettings = {
    keyPress: {
        left: "KeyA",
        right: "KeyD",
        up: "KeyW",
        down: "KeyS",
        space: "Space",
        enter: "Enter"
    },
}

const GameManager = {
    width: null,
    height: null,
    assets: {},
    players: [],
    keyboard: null,
    gameState: null,
    draw(ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, this.width, this.height);
        if (this.gameState == "playing") {
            for (let plr of this.players)
                plr.draw(ctx);
        }
        else {
            console.log("bruh");
        }
    },
    update() {
        if (this.gameState == "playing") {
            for (let plr of this.players)
                plr.update();
        }
        else {
            console.log("bruhx2");
        }
    }
};