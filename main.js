
function loadAsset(name) {
    let img = new Image();
    let fileName = 'assets/' + name + '.png';

    return new Promise(res => {
        img.src = fileName;
        img.onload = () => res(GameManager.assets[name] = img);
    });
}

function drawMenu(ctx) {
    ctx.fillStyle = "#9999f0";
    ctx.fillRect(0, 0, ctx.canvas.width / devicePixelRatio, ctx.canvas.width / devicePixelRatio);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Shooter", ctx.canvas.width / devicePixelRatio / 2, ctx.canvas.height / devicePixelRatio / 3);
}

function updateMenu() {

}

function drawPlaying(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width / devicePixelRatio, ctx.canvas.width / devicePixelRatio);
    for (let obj of GameManager.objects)
        obj.draw(ctx);
}

function updatePlaying() {
    for (let obj of GameManager.objects)
        obj.update();
}

function draw(ctx) {
    switch (GameManager.gameState) {
        case "playing":
            drawPlaying(ctx);
            break;
        case "menu":
            drawMenu(ctx);
            break;
        default:
            throw new Error("Wrong gameState discovered when trying to draw!");
    }
}

function update() {
    if (GameManager.gameState == "menu" && GameManager.keyboard.get(GameSettings.keyPress.enter)) {
        GameManager.gameState = "playing";
        onGameStart();
    }
    switch (GameManager.gameState) {
        case "playing":
            updatePlaying();
            break;
        case "menu":
            updateMenu();
            break;
        default:
            throw new Error("Wrong gameState discovered when trying to update!");
    }
}

function onGameStart() {
    GameManager.objects.push(new Player(0, 0));
}

async function main() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    await Promise.all(ImageFiles.map(loadAsset));
    console.log("Assets loaded!");

    window.addEventListener('keydown', ev => GameManager.keyboard.set(ev.code, true));
    window.addEventListener('keyup', ev => GameManager.keyboard.set(ev.code, false));

    function animate() {
        update();
        draw(ctx);
        window.requestAnimationFrame(animate);
    }
    animate();
}

main();
