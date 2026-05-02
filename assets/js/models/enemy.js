class Enemy {

    static createEnemyShip(ctx, x, y) {
        return new Enemy(
            ctx,
            x,
            y,
            enemyShip_width,
            enemyShip_height,
            enemyShip_vf,
            enemyShip_hf,
            enemyShip_sprite
        )
    }

    constructor(ctx, x, y, w, h, vFrames, hFrames, src) {
        this.ctx = ctx

        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.vy = enemyShip_vy
        this.animTick = 0

        this.sprite = new Image()
        this.sprite.src = src
        this.sprite.vFrame = vFrames
        this.sprite.hFrame = hFrames
        this.sprite.frameIndex = 0
        this.sprite.onload = () => {
            this.sprite.isReady = true
            this.sprite.frameW = Math.floor(this.sprite.width / this.sprite.vFrame)
            this.sprite.frameH = Math.floor(this.sprite.height / this.sprite.hFrame)
        }
    }

    draw() {
        if (this.sprite.isReady) {
            const col = this.sprite.frameIndex % this.sprite.vFrame
            const row = 0

            this.ctx.save()
            this.ctx.globalCompositeOperation = 'lighter'
            this.ctx.drawImage(
                this.sprite,
                col * this.sprite.frameW,
                row * this.sprite.frameH,
                this.sprite.frameW,
                this.sprite.frameH,
                this.x,
                this.y,
                this.w,
                this.h
            )
            this.ctx.restore()
        }
    }

    move() {
        this.y += this.vy

        this.animTick++
        if (this.animTick >= enemyShip_ANIM_SPEED) {
            this.animTick = 0
            this.sprite.frameIndex = (this.sprite.frameIndex + 1) % enemyShip_FRAMES
        }
    }
}