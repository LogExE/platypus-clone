'use strict';

function loadImage(name) {
    let img = new Image();
    let fileName = 'assets/img/' + name + '.png';

    return new Promise(res => {
        img.src = fileName;
        img.onload = () => res([name, img]);
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

function drawPlaying(objects, images, ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width / devicePixelRatio, ctx.canvas.width / devicePixelRatio);
    for (let obj of objects) {
        if (GameSettings.debug && obj.box) {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        if (obj instanceof Player) {
            ctx.drawImage(images.get("playerShip"), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof Projectile) {
            ctx.drawImage(images.get("bullet"), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof EnemyUFO) {
            ctx.drawImage(images.get("ufo"), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else throw new Error("Tried to draw unknown object!");
    }
}

function updatePlaying(dt, objects, keyboard) {
    let spawn = x => objects.add(x);
    for (let obj of objects)
        if (obj instanceof Player) {
            obj.update(dt, spawn, keyboard);
        }
        else
            obj.update(dt, spawn);
    for (let obj1 of objects)
        for (let obj2 of objects)
            if (obj1 != obj2 && obj1.box.testCol(obj2.box)) {
                obj1.hit(obj2, () => objects.delete(obj1));
                obj2.hit(obj1, () => objects.delete(obj2));
            }
}

function draw(gameManager, ctx) {
    switch (gameManager.state) {
        case "playing":
            drawPlaying(gameManager.objects, gameManager.images, ctx);
            break;
        case "menu":
            drawMenu(ctx);
            break;
        default:
            throw new Error("Wrong gameState discovered when trying to draw!");
    }
}

function update(gameManager, dt) {
    if (gameManager.state == "menu" && gameManager.keyboard.get(GameSettings.keyPress.enter)) {
        gameManager.state = "playing";
        gameManager.objects.add(new Player(0, 0));
    }
    switch (gameManager.state) {
        case "playing":
            updatePlaying(dt, gameManager.objects, gameManager.keyboard);
            break;
        case "menu":
            updateMenu(dt);
            break;
        default:
            throw new Error("Wrong gameState discovered when trying to update!");
    }
}

async function main() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const gameManager = {
        images: null,
        objects: new Set(),
        keyboard: new Map(),
        state: "menu"
    };

    const dpr = window.devicePixelRatio;
    let realw = canvas.width, realh = canvas.height;
    canvas.width *= dpr;
    canvas.height *= dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${realw}px`;
    canvas.style.height = `${realh}px`;

    let imgs = await Promise.all(ImageFiles.map(loadImage));
    console.log("Assets loaded!");
    gameManager.images = new Map(imgs);

    window.addEventListener('keydown', ev => gameManager.keyboard.set(ev.code, true));
    window.addEventListener('keyup', ev => gameManager.keyboard.set(ev.code, false));

    canvas.addEventListener('mousedown', ev => gameManager.objects.add(new EnemyUFO(ev.clientX, ev.clientY)));

    console.log(gameManager);

    let previousTimeStamp;
    function animate(now) {
        if (!previousTimeStamp)
            previousTimeStamp = now;
        update(gameManager, (now - previousTimeStamp) * 0.1);
        draw(gameManager, ctx);
        previousTimeStamp = now;
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}

main();
