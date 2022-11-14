'use strict';

class Player {
    static SPEED = 600;
    static WIDTH = 150;
    static HEIGHT = 70;
    static RESPAWN_TIME = 2;
    //static BLINK_TIME = 2;
    static COOLDOWNS = {
        [DefaultProjectile]: 0.2,
        [PulseProjectile]: 0.8,
        [FastProjectile]: 0.05
    };

    appear() {
        this.active = true;
    }

    disappear() {
        this.active = false;
    }

    constructor(x, y) {
        this.v_x = 0;
        this.v_y = 0;
        this.box = new CollisionBox(x, y, Player.WIDTH, Player.HEIGHT);
        this.active = true;

        this.canFire = true;
        this.current_projectile = DefaultProjectile;
        this.powerupTime = 0;

        this.lives = 3;
        this.score = 0;
    }

    hit(obj, { perish, spawn, playAudio }) {
        if (!(obj instanceof Player) && !(obj instanceof Projectile && obj.whoFired instanceof Player) && !(obj instanceof Powerup)) {
            playAudio(Sound.bigexplosion);
            if (this.lives == 0)
                perish();
            else {
                --this.lives;
                this.disappear();
                setTimeout(() => this.appear(), Player.RESPAWN_TIME * 1000);
            }
        }
    }

    update(dt, { perish, spawn, playAudio }, input) {
        let hor = input.get("horizontal");
        let ver = input.get("vertical");
        let len = Math.sqrt(Math.pow(hor, 2) + Math.pow(ver, 2));
        if (len > 0) {
            hor /= len;
            ver /= len;
        }
        this.v_x = hor * Player.SPEED;
        this.v_y = ver * Player.SPEED;
        this.box.x = Math.max(0, Math.min(this.box.x + this.v_x * dt, SCREEN_WIDTH - this.box.w));
        this.box.y = Math.max(0, Math.min(this.box.y + this.v_y * dt, SCREEN_HEIGHT - this.box.h));

        if (input.get("space") && this.canFire) {
            if (this.current_projectile == DefaultProjectile || this.current_projectile == FastProjectile) {
                spawn(new DefaultProjectile(this, this.box.x + this.box.w, this.box.y + this.box.h / 2, 800, 0));
                playAudio(Sound.shot);
            }
            else if (this.current_projectile == PulseProjectile) {
                spawn(new PulseProjectile(this, this.box.x + this.box.w, this.box.y + this.box.h / 2, 400, 0));
                playAudio(Sound.pulseshot);
            }
            this.canFire = false;
            setTimeout(() => this.canFire = true, Player.COOLDOWNS[this.current_projectile] * 1000);
        }
    }
}