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

function drawMenu(ctx) {
    ctx.fillStyle = "#9999f0";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Shooter", ctx.canvas.width / 2, ctx.canvas.height / 3);
}

function updateMenu() {

}

function drawPlaying(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let obj of this.objects)
        obj.draw(ctx);
}

function updatePlaying() {
    for (let obj of this.objects)
        obj.update();
}

function onGameStart() {
    this.objects.push(new Player(0, 0));
}

const GameManager = {
    assets: {},
    objects: [],
    keyboard: null,
    gameState: null,
    draw(ctx) {
        switch (this.gameState) {
            case "playing":
                drawPlaying.call(this, ctx);
                break;
            case "menu":
                drawMenu.call(this, ctx);
                break;
            default:
                throw new Error("Wrong gameState discovered when trying to draw!");
        }
    },
    update() {
        if (this.gameState == "menu" && this.keyboard.get(GameSettings.keyPress.enter)) {
            this.gameState = "playing";
            onGameStart.call(this);
        }
        switch (this.gameState) {
            case "playing":
                updatePlaying.call(this);
                break;
            case "menu":
                updateMenu.call(this);
                break;
            default:
                throw new Error("Wrong gameState discovered when trying to update!");
        }
    }
};