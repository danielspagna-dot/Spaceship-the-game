class Capsule {

    static create(ctx, x, y) {
        return new Capsule(ctx, x, y)
    }

    constructor(ctx, x, y) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.w = CAPSULE_W
        this.h = CAPSULE_H
        this.vy = CAPSULE_VY
        this.collected = false

        this.sprite = new Image()
        this.sprite.src = CAPSULE_SPRITE
        this.sprite.onload = () => {
            this.sprite.isReady = true
            this.sprite.frameW = Math.floor(this.sprite.width / CAPSULE_VF)
            this.sprite.frameH = Math.floor(this.sprite.height / CAPSULE_HF)
        }
    }

    move() {
        this.y += this.vy
    }

    draw() {
        if (!this.sprite.isReady || this.collected) return

        this.ctx.save()
        this.ctx.globalCompositeOperation = 'lighter'
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
        this.ctx.restore()
    }
}