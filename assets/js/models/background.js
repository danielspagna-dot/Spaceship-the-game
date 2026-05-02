class Background {
 
    constructor(ctx, onReady) {
        this.ctx = ctx
        this.w = ctx.canvas.width
        this.h = ctx.canvas.height
        this.y = 0
 
        this.image = new Image()
        this.image.src = BG_MAIN
        this.image.onload = () => {
            this.image.isReady = true
            if (onReady) onReady()
        }
    }
 
    move() {
        this.y = (this.y + BG_SCROLL_SPEED) % this.h
    }
 
    draw() {
        if (!this.image.isReady) return
 
        const y = Math.floor(this.y)
 
        this.ctx.drawImage(this.image, 0, y, this.w, this.h)
        this.ctx.drawImage(this.image, 0, y - this.h, this.w, this.h)
    }
}