'use strict';

class Player {
    static SPEED = 400;
    static WIDTH = 150;
    static HEIGHT = 70;
    static COOLDOWNS = {
        [DefaultProjectile]: 0.2,
        [PulseProjectile]: 0.8,
        [FastProjectile]: 0.05
    };
    constructor(x, y) {
        this.v_x = 0;
        this.v_y = 0;
        this.box = new CollisionBox(x, y, Player.WIDTH, Player.HEIGHT);

        this.cd = 0;

        this.respawn_timer = 2000;
        this.current_projectile = DefaultProjectile;
        this.poweruptimer = 0;

        this.score = 0;
        this.lives = 3;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (!(obj instanceof Player) && !(obj instanceof Projectile && obj.whoFired instanceof Player) && !(obj instanceof Powerup)) {
            playAudio(Sound.bigexplosion);
            perish();
        }
    }

    update(dt, { perish, spawn, playAudio }, input) {
        let len = Math.sqrt(Math.pow(input.get("horizontal"), 2) + Math.pow(input.get("vertical"), 2));
        this.v_x = input.get("horizontal") / (len || 1) * Player.SPEED;
        this.v_y = input.get("vertical") / (len || 1) * Player.SPEED;
        this.box.x = Math.max(0, Math.min(this.box.x + this.v_x * dt, SCREEN_WIDTH - this.box.w));
        this.box.y = Math.max(0, Math.min(this.box.y + this.v_y * dt, SCREEN_HEIGHT - this.box.h));

        if (this.cd > 0)
            this.cd = Math.max(this.cd - dt, 0);
        else if (input.get("space")) {
            if (this.current_projectile == DefaultProjectile || this.current_projectile == FastProjectile) {
                spawn(new DefaultProjectile(this, this.box.x + this.box.w, this.box.y + this.box.h / 2, 800, 0));
                playAudio(Sound.shot);
            }
            else if (this.current_projectile == PulseProjectile) {
                spawn(new PulseProjectile(this, this.box.x + this.box.w, this.box.y + this.box.h / 2, 400, 0));
                playAudio(Sound.pulseshot);
            }
            this.cd = Player.COOLDOWNS[this.current_projectile];
        }
        if (this.poweruptimer > 0) {
            this.poweruptimer = Math.max(this.poweruptimer - dt, 0);
            if (this.poweruptimer == 0)
                this.current_projectile = DefaultProjectile;
        }
    }
}