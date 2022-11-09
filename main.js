'use strict';

function loadImage(name) {
    let img = new Image();

    return new Promise(res => {
        img.src = 'assets/img/' + name + '.png';
        img.onload = () => res([name, img]);
    });
}

function playAudio(name) {
    let aud = new Audio('assets/snd/' + name + '.ogg');
    aud.volume = 0.1;
    aud.play();
}

function drawMenu(ctx) {
    ctx.fillStyle = "#9999f0";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Shooter", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3);
}

function updateMenu(dt) {

}

function drawPlaying(objects, textures, ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let obj of objects) {
        if (GameSettings.debug && obj.box) {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        if (obj instanceof Player) {
            ctx.drawImage(textures.get(Texture.player), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof DefaultProjectile) {
            ctx.drawImage(textures.get(Texture.defProjectile), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof SmallProjectile) {
            ctx.drawImage(textures.get(Texture.smolProjectile), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof EnemyUFO) {
            ctx.drawImage(textures.get(Texture.ufo), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else throw new Error("Tried to draw unknown object!");
    }
}

function updatePlaying(dt, objects, keyboard) {
    let spawn = x => objects.add(x);
    for (let obj of objects) {
        let perish = () => objects.delete(obj);
        if (obj instanceof Player) {
            obj.update(dt, { perish, spawn, playAudio }, keyboard);
        }
        else
            obj.update(dt, { perish, spawn, playAudio });
    }

    for (let obj1 of objects)
        for (let obj2 of objects)
            if (obj1 != obj2 && obj1.box.testCol(obj2.box)) {
                obj1.hit(obj2, { perish: () => objects.delete(obj1), spawn, playAudio });
                obj2.hit(obj1, { perish: () => objects.delete(obj2), spawn, playAudio });
            }
}

function draw(gameManager, ctx) {
    ctx.save();
    ctx.scale(ctx.canvas.width / SCREEN_WIDTH, ctx.canvas.height / SCREEN_HEIGHT);
    switch (gameManager.state) {
        case "playing":
            drawPlaying(gameManager.objects, gameManager.textures, ctx);
            break;
        case "menu":
            drawMenu(ctx);
            break;
        default:
            throw new Error("Wrong gameState discovered when trying to draw!");
    }
    ctx.restore();
}

function update(gameManager, dt) {
    if (gameManager.state == "menu" && gameManager.keyboard.get(GameSettings.keyPress.enter)) {
        gameManager.state = "playing";
        gameManager.objects.add(new Player(10, SCREEN_HEIGHT / 2));
        setTimeout(function addUFOs() {
            gameManager.objects.add(new EnemyUFO(SCREEN_WIDTH, Math.random() * SCREEN_HEIGHT));
            setTimeout(addUFOs, 500 + Math.random() * 5000);
        }, 2500);
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
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext("2d");
    const gameManager = {
        textures: null,
        objects: new Set(),
        keyboard: new Map(),
        state: "menu"
    };

    // const dpr = window.devicePixelRatio;
    // let realw = canvas.width, realh = canvas.height;
    // canvas.width *= dpr;
    // canvas.height *= dpr;
    // ctx.scale(dpr, dpr);
    // canvas.style.width = `${realw}px`;
    // canvas.style.height = `${realh}px`;

    let txtrs = await Promise.all(Object.values(Texture).map(loadImage));
    console.log("Assets loaded!");
    gameManager.textures = new Map(txtrs);

    window.addEventListener('keydown', ev => gameManager.keyboard.set(ev.code, true));
    window.addEventListener('keyup', ev => gameManager.keyboard.set(ev.code, false));

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
