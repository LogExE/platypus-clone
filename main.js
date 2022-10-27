
function loadAsset(name) {
    let img = new Image();
    let fileName = 'assets/' + name + '.png';

    return new Promise(res => {
        img.src = fileName;
        img.onload = () => res(GameManager.assets[name] = img);
    });
}

async function main() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    await Promise.all(ImageFiles.map(loadAsset));
    console.log("Assets loaded!");

    GameManager.keyboard = new Map();
    window.addEventListener('keydown', ev => GameManager.keyboard.set(ev.code, true));
    window.addEventListener('keyup', ev => GameManager.keyboard.set(ev.code, false));

    GameManager.gameState = "menu";

    function animate() {
        GameManager.update();
        GameManager.draw(ctx);
        window.requestAnimationFrame(animate);
    }
    animate();
}

main();