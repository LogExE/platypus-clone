
class InputHandler {
    get() {
        throw Error("Not implemented");
    }
}

class KeyboardInputHandler extends InputHandler {
    constructor() {
        super();
        this.inputs = new Map();
        window.addEventListener('keydown', ev => this.inputs.set(ev.code, true));
        window.addEventListener('keyup', ev => this.inputs.set(ev.code, false));
    }
    get(str) {
        if (str == "horizontal")
            return (this.inputs.get(GameSettings.keyPress.right) ?? 0) - (this.inputs.get(GameSettings.keyPress.left) ?? 0);
        else if (str == "vertical")
            return (this.inputs.get(GameSettings.keyPress.down) ?? 0) - (this.inputs.get(GameSettings.keyPress.up) ?? 0);
        else return this.inputs.get(GameSettings.keyPress[str]);
    }
}

class GamepadInputHandler extends InputHandler {
    constructor(index) {
        super();
        this.index = index;
    }
    get(str) {
        let gamepad = navigator.getGamepads()[this.index];
        let dumbFix = num => Math.floor(num * 10) / 10;
        if (str == "horizontal")
            return dumbFix(gamepad.axes[GameSettings.gamepadMappings.horizontal]);
        else if (str == "vertical")
            return dumbFix(gamepad.axes[GameSettings.gamepadMappings.vertical]);
        else if (str == "space")
            return gamepad.buttons[GameSettings.gamepadMappings.a].pressed;
    }
}

class TapInputHandler extends InputHandler {
    constructor() {
        super();
        this.touches = new Map();
        window.addEventListener('touchstart', ev => {
            ev.preventDefault();
            for (let touch of ev.changedTouches)
                this.touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
        }, { passive: false });
        window.addEventListener('touchmove', ev => {
            ev.preventDefault();
            for (let touch of ev.changedTouches)
                this.touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
        }, { passive: false });
        window.addEventListener('touchend', ev => {
            ev.preventDefault();
            for (let touch of ev.changedTouches)
                this.touches.delete(touch.identifier);
        }, { passive: false });
    }

    get(str) {
        let tmp = [...this.touches.values()];
        const centerX = window.innerWidth / 4, centerY = window.innerHeight / 2;
        const rad = Math.min(centerX, centerY);
        let near = tmp.filter(t => t.x <= window.innerWidth / 2);
        if (str == "horizontal")
            return near[0] ? (near[0].x - centerX) : 0;
        else if (str == "vertical")
            return near[0] ? (near[0].y - centerY) : 0;
        else if (str == "space" || str == "enter")
            return tmp.some(t => t.x > window.innerWidth / 2);
    }
}