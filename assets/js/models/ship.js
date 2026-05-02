class Ship {
 
    constructor(ctx, x, y) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.ground = 0
        this.visible = true
 
        this.h = SHIP_H
        this.w = SHIP_W
 
        this.vx = 0
        this.vy = 0
        this.ay = 0
 
        this.animTick = 0
        this.slowUntil = 0
        this.slowFactor = 1
 
        this.sprite = new Image()
        this.sprite.src = SHIP_SPRITE
        this.sprite.onload = () => {
            this.sprite.isReady = true
            this.sprite.cols = 3
            this.sprite.rows = 1
            this.sprite.frameW = Math.floor(this.sprite.width / this.sprite.cols)
            this.sprite.frameH = this.sprite.height
            this.sprite.frameIndex = 0
        }
    }
 
    groundTo(groundY) {
        this.y = groundY - this.h
        this.ground = groundY - this.h
    }
 
    onKeyEvent(event) {
        const isPressed = event.type === 'keydown'
        switch(event.keyCode) {
            case KEY_RIGHT:
                if (isPressed) { this.vx = SHIP_VX } else { this.vx = 0 }
                break
            case KEY_LEFT:
                if (isPressed) { this.vx = -SHIP_VX } else { this.vx = 0 }
                break
            case KEY_UP:
                this.vy = -SHIP_VY
                this.ay = SHIP_AY
                break
        }
    }
 
    applySlow(duration, factor) {
        this.slowUntil = performance.now() + duration
        this.slowFactor = factor
    }

    move() {
        if (!this.visible) return

        const now = performance.now()
        const factor = now < this.slowUntil ? this.slowFactor : 1

        this.vy += this.ay
        this.x += this.vx * factor
        this.y += this.vy * factor
 
        if (this.y > this.ground) {
            this.y = this.ground
            this.vy = 0
            this.ay = 0
        }
 
        this.animTick++
        if (this.animTick >= SHIP_ANIM_SPEED) {
            this.animTick = 0
            this.sprite.frameIndex = (this.sprite.frameIndex + 1) % SHIP_FRAMES
        }
    }
 
    draw() {
        if (!this.visible) return
        if (this.sprite.isReady) {
            const col = this.sprite.frameIndex % this.sprite.cols
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
}