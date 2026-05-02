class Slow {

    static create(ctx, x, y) {
        return new Slow(ctx, x, y)
    }

    constructor(ctx, x, y) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.w = SLOW_W
        this.h = SLOW_H
        this.vy = SLOW_VY
        this.collected = false

        this.sprite = new Image()
        this.sprite.src = SLOW_SPRITE
        this.sprite.onload = () => {
            this.sprite.isReady = true
            this.sprite.frameW = Math.floor(this.sprite.width / SLOW_VF)
            this.sprite.frameH = Math.floor(this.sprite.height / SLOW_HF)
        }
    }

    move() {
        this.y += this.vy
    }

    draw() {
        if (!this.sprite.isReady || this.collected) return

        this.ctx.drawImage(
            this.sprite,
            0,
            0,
            this.sprite.frameW,
            this.sprite.frameH,
            this.x,
            this.y,
            this.w,
            this.h
        )
    }
}