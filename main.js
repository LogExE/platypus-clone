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

function drawText(ctx, text, font, color, x, y, align) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

function clear(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}


function drawMenu(ctx) {
    clear(ctx, "#ffffff");
    drawText(ctx, "Shooter", "bold 50px Georgia", "#000000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3, "center");
}

function updateMenu(dt) {

}

function drawPlaying(objects, textures, ctx) {
    clear(ctx, "#9999f0");
    let plrs = [];
    for (let obj of objects) {
        if (GameSettings.debug && obj.box) {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        if (obj instanceof Player) {
            plrs.push(obj);
            ctx.drawImage(textures.get(Texture.player), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof Powerup) {
            if (obj.curBonus() == FastProjectile)
                ctx.drawImage(textures.get(Texture.powerupFast), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
            else if (obj.curBonus() == PulseProjectile)
                ctx.drawImage(textures.get(Texture.powerupPulse), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof DefaultProjectile || obj instanceof FastProjectile) {
            ctx.drawImage(textures.get(Texture.defProjectile), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof PulseProjectile) {
            ctx.drawImage(textures.get(Texture.pulseProjectile), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof SmallProjectile) {
            ctx.drawImage(textures.get(Texture.smolProjectile), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else if (obj instanceof EnemyUFO) {
            ctx.drawImage(textures.get(Texture.ufo), obj.box.x, obj.box.y, obj.box.w, obj.box.h);
        }
        else throw new Error("Tried to draw unknown object!");
    }
    let text = [];
    for (let plr of plrs) {
        let msg = " Score: " + plr.score;
        if (plr.powerupTime > 0)
            msg += " powerup: " + plr.powerupTime;
        text.push(msg);
    }
    drawText(ctx, text.join(';'), "30px Georgia", "#000000", 0, 30, "left");
}

function updatePlaying(dt, objects, inputHandlers) {
    let spawn = x => objects.add(x);
    for (let obj of objects) {
        let perish = () => objects.delete(obj);
        if (obj instanceof Player) {
            obj.update(dt, { perish, spawn, playAudio }, inputHandlers.inputs.get(obj));
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
    if (gameManager.state == "menu" && gameManager.inputHandlers.primary.get("enter")) {
        gameManager.state = "playing";

        let plr = new Player(10, SCREEN_HEIGHT / 2);
        gameManager.objects.add(plr);
        gameManager.inputHandlers.inputs.set(plr, gameManager.inputHandlers.primary);
        //cheats huehuehue
        window.addEventListener("keydown", e => (e.code == 'Digit1') ? gameManager.objects.add(new Powerup(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)) : 42);

        window.addEventListener("gamepadconnected", (e) => {
            let newplr = new Player(10, SCREEN_HEIGHT / 2 + Math.random() * 500 - 250);
            gameManager.objects.add(newplr);
            gameManager.inputHandlers.inputs.set(newplr, new GamepadInputHandler(e.gamepad.index));
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            console.log("Gamepad disconnected from index %d: %s",
                e.gamepad.index, e.gamepad.id);
        });
        setTimeout(function addUFOs() {
            gameManager.objects.add(new EnemyUFO(SCREEN_WIDTH, Math.random() * SCREEN_HEIGHT));
            setTimeout(addUFOs, 500 + Math.random() * 5000);
        }, 2500);
        setTimeout(function addPowerups() {
            gameManager.objects.add(new Powerup(SCREEN_WIDTH, Math.random() * SCREEN_HEIGHT));
            setTimeout(addPowerups, 20000);
        }, 10000);
    }
    switch (gameManager.state) {
        case "playing":
            updatePlaying(dt, gameManager.objects, gameManager.inputHandlers);
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
    let resize = () => {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        let realw = canvas.width, realh = canvas.height;
        canvas.width *= window.devicePixelRatio;
        canvas.height *= window.devicePixelRatio;
        canvas.style.width = `${realw}px`;
        canvas.style.height = `${realh}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");
    const gameManager = {
        textures: null,
        objects: new Set(),
        inputHandlers: { primary: null, inputs: new Map() },
        state: "menu",
    };
    let inpHandler = new KeyboardInputHandler();
    gameManager.inputHandlers.primary = inpHandler;

    let txtrs = await Promise.all(Object.values(Texture).map(loadImage));
    console.log("Assets loaded!");
    gameManager.textures = new Map(txtrs);

    let previousTimeStamp;
    function animate(now) {
        if (!previousTimeStamp)
            previousTimeStamp = now;
        update(gameManager, (now - previousTimeStamp) / 1000);
        draw(gameManager, ctx);
        previousTimeStamp = now;
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}

main();
