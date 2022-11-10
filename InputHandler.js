
class InputHandler {
    constructor() {
        this.inputs = new Map();
    }
    get() {
        throw Error("Not implemented");
    }
}

class KeyboardInputHandler extends InputHandler {
    constructor() {
        super();
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
        this.inputs.set("horizontal", dumbFix(gamepad.axes[GameSettings.gamepadMappings.horizontal]));
        this.inputs.set("vertical", dumbFix(gamepad.axes[GameSettings.gamepadMappings.vertical]));
        this.inputs.set("space", gamepad.buttons[GameSettings.gamepadMappings.a].pressed);

        return this.inputs.get(str);
    }
}

class TapInputHandler extends InputHandler {
    constructor() {
        super();
    }
}