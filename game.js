
const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
ctx.font = "30px Georgia";

const keyboard = new Map();
function keyDownHandler(ev) {
    keyboard.set(ev.keyCode, true);
}
function keyUpHandler(ev) {
    keyboard.set(ev.keyCode, false);
}
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.v_x = 0;
        this.v_y = 0;
    }
    update() {
        if (keyboard.get('D'.charCodeAt(0)))
            this.v_x = 2;
        else if (keyboard.get('A'.charCodeAt(0)))
            this.v_x = -2;
        else this.v_x = 0;
        if (keyboard.get('W'.charCodeAt(0)))
            this.v_y = -2;
        else if (keyboard.get('S'.charCodeAt(0)))
            this.v_y = 2;
        else this.v_y = 0;
        this.x += this.v_x;
        this.y += this.v_y;
    }
    draw() {
        ctx.fillStyle = "#FFD580";
        ctx.fillRect(this.x, this.y, 80, 60);
    }
}

function drawMenu() {
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillText("Shooter", drawMenu.x, 90);
    if (drawMenu.x + 30 * 3 == canvas.width)
        drawMenu.step = -2;
    else if (drawMenu.x == 0)
        drawMenu.step = 2;
    drawMenu.x += drawMenu.step;
}
drawMenu.x = 10;
drawMenu.step = 2;

let plr = new Player();
function drawGame() {
    plr.update();

    ctx.fillStyle = "#0088aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    plr.draw();
}

let state = {
    scene: "menu"
};
function draw() {
    window.requestAnimationFrame(draw);
    if (keyboard.get(13))
        state.scene = "game";
    if (state.scene == "menu")
        drawMenu();
    else if (state.scene == "game")
        drawGame();
}

draw();