class Henemy {
 
    static createFromLeft(ctx, canvasHeight) {
        const x = -HENEMY_W
        const y = Math.random() * (canvasHeight - HENEMY_H)
        return new Henemy(ctx, x, y, HENEMY_VX)
    }
 
    static createFromRight(ctx, canvasWidth, canvasHeight) {
        const x = canvasWidth
        const y = Math.random() * (canvasHeight - HENEMY_H)
        return new Henemy(ctx, x, y, -HENEMY_VX)
    }
 
    constructor(ctx, x, y, vx) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.w = HENEMY_W
        this.h = HENEMY_H
        this.vx = vx
        this.animTick = 0
        this.destroyed = false
 
        this.sprite = new Image()
        this.sprite.src = HENEMY_SPRITE
        this.sprite.vFrame = HENEMY_VF
        this.sprite.hFrame = HENEMY_HF
        this.sprite.frameIndex = 0
        this.sprite.onload = () => {
            this.sprite.isReady = true
            this.sprite.frameW = Math.floor(this.sprite.width / this.sprite.vFrame)
            this.sprite.frameH = Math.floor(this.sprite.height / this.sprite.hFrame)
        }
    }
 
    move() {
        this.x += this.vx
 
        this.animTick++
        if (this.animTick >= HENEMY_ANIM_SPEED) {
            this.animTick = 0
            this.sprite.frameIndex = (this.sprite.frameIndex + 1) % HENEMY_FRAMES
        }
    }
 
    draw() {
        if (!this.sprite.isReady || this.destroyed) return
 
        const col = this.sprite.frameIndex % this.sprite.vFrame
        const row = 0
 
        this.ctx.save()
        if (this.vx > 0) {
            this.ctx.translate(this.x + this.w, this.y)
            this.ctx.scale(-1, 1)
            this.ctx.globalCompositeOperation = 'lighter'
            this.ctx.drawImage(
                this.sprite,
                col * this.sprite.frameW,
                row * this.sprite.frameH,
                this.sprite.frameW,
                this.sprite.frameH,
                0, 0, this.w, this.h
            )
        } else {
            this.ctx.globalCompositeOperation = 'lighter'
            this.ctx.drawImage(
                this.sprite,
                col * this.sprite.frameW,
                row * this.sprite.frameH,
                this.sprite.frameW,
                this.sprite.frameH,
                this.x, this.y, this.w, this.h
            )
        }
        this.ctx.restore()
    }
 
    isOutOfBounds(canvasWidth) {
        return this.x > canvasWidth + this.w || this.x < -this.w * 2
    }
}