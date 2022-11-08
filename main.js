'use strict';

function loadImage(name) {
    let img = new Image();
    let fileName = 'assets/img/' + name + '.png';

    return new Promise(res => {
        img.src = fileName;
        img.onload = () => res(GameManager.assets[name] = img);
    });
}

function loadAudio(name) {
    
}

function drawMenu(ctx) {
    ctx.fillStyle = "#9999f0";
    ctx.fillRect(0, 0, ctx.canvas.width / devicePixelRatio, ctx.canvas.width / devicePixelRatio);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Shooter", ctx.canvas.width / devicePixelRatio / 2, ctx.canvas.height / devicePixelRatio / 3);
}

function updateMenu(dt) {

}

function drawPlaying(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width / devicePixelRatio, ctx.canvas.width / devicePixelRatio);
    for (let obj of GameManager.objects)
        obj.draw(ctx);
    for (let proj of GameManager.projectiles)
        proj.draw(ctx);
}

function updatePlaying(dt) {
    GameManager.objects.forEach((obj, i) => {
        GameManager.projectiles.forEach((proj, j) => {
            if (obj != proj.whoFired && obj.box.testCol(proj.box)) {
                GameManager.objects.splice(i, 1);
                GameManager.projectiles.splice(j, 1);
            }
        });
    });
    for (let obj of GameManager.objects)
        obj.update(dt);
    for (let proj of GameManager.projectiles)
        proj.update(dt);
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

function update(dt) {
    if (GameManager.gameState == "menu" && GameManager.keyboard.get(GameSettings.keyPress.enter)) {
        GameManager.gameState = "playing";
        onGameStart();
    }
    switch (GameManager.gameState) {
        case "playing":
            updatePlaying(dt);
            break;
        case "menu":
            updateMenu(dt);
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

    const dpr = window.devicePixelRatio;
    let realw = canvas.width, realh = canvas.height;

    canvas.width *= dpr;
    canvas.height *= dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = `${realw}px`;
    canvas.style.height = `${realh}px`;

    await Promise.all(ImageFiles.map(loadImage));
    console.log("Assets loaded!");

    window.addEventListener('keydown', ev => GameManager.keyboard.set(ev.code, true));
    window.addEventListener('keyup', ev => GameManager.keyboard.set(ev.code, false));

    canvas.addEventListener('mousedown', ev => GameManager.objects.push(new EnemyUFO(ev.clientX, ev.clientY)));

    let previousTimeStamp;
    function animate(now) {
        if (!previousTimeStamp)
            previousTimeStamp = now;
        update((now - previousTimeStamp) * 0.1);
        draw(ctx);
        previousTimeStamp = now;
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}

main();
