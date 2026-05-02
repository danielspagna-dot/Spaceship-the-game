class Game {
 
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.canvas.width = CANVAS_W
        this.canvas.height = CANVAS_H
        this.ctx = this.canvas.getContext('2d')

        this.fps = FPS
        this.drawIntervalId = undefined

        this.gameOver = false
        this.started = false
        this.enemies = []
        this.capsules = []

        this.spawnInterval = 2000
        this.lastSpawnTime = 0
        this.lastCapsuleSpawnTime = 0
        this.capsuleSpawnInterval = CAPSULE_SPAWN_INTERVAL_MIN + Math.random() * (CAPSULE_SPAWN_INTERVAL_MAX - CAPSULE_SPAWN_INTERVAL_MIN)

        this.slows = []
        this.lastSlowSpawnTime = 0
        this.slowSpawnInterval = SLOW_SPAWN_INTERVAL_MIN + Math.random() * (SLOW_SPAWN_INTERVAL_MAX - SLOW_SPAWN_INTERVAL_MIN)

        this.henenemies = []
        this.lastHenenySpawnTime = 0
        this.henenySpawnInterval = HENEMY_SPAWN_INTERVAL_MIN + Math.random() * (HENEMY_SPAWN_INTERVAL_MAX - HENEMY_SPAWN_INTERVAL_MIN)

        this.score = 0
        this.lastScoreTime = 0
        this.finalScore = 0

        this.background = new Background(this.ctx, () => this._onAssetsReady())

        this._spaceHandler = (e) => {
            if (e.keyCode === 32) this._onSpace()
        }
        addEventListener('keydown', this._spaceHandler)
    }

    _onAssetsReady() {
        this.ship = new Ship(this.ctx, 150, 150)
        this.ship.groundTo(this.canvas.height)
        this._startRenderLoop()
    }

    _startRenderLoop() {
        if (!this.drawIntervalId) {
            this.drawIntervalId = setInterval(() => {
                this.clear()
                this.move()
                this.draw()
            }, this.fps)
        }
    }

    _onSpace() {
        if (!this.started) {
            this.started = true
            this._setupGameListeners()
            this.lastSpawnTime = performance.now()
            this.lastScoreTime = performance.now()
            this.lastCapsuleSpawnTime = performance.now()
            this.lastSlowSpawnTime = performance.now()
            this.lastHenenySpawnTime = performance.now()
            this.score = 0
        } else if (this.gameOver) {
            this._reset()
        }
    }

    _setupGameListeners() {
        if (this._gameListenersSet) return
        this._gameListenersSet = true
        addEventListener('keydown', (e) => { if (e.keyCode !== 32) this.ship.onKeyEvent(e) })
        addEventListener('keyup', (e) => this.ship.onKeyEvent(e))
    }

    _reset() {
        this.gameOver = false
        this.enemies = []
        this.capsules = []
        this.slows = []
        this.henenemies = []
        this.spawnInterval = 2000
        this.lastSpawnTime = performance.now()
        this.lastScoreTime = performance.now()
        this.lastCapsuleSpawnTime = performance.now()
        this.lastSlowSpawnTime = performance.now()
        this.lastHenenySpawnTime = performance.now()
        this.slowSpawnInterval = SLOW_SPAWN_INTERVAL_MIN + Math.random() * (SLOW_SPAWN_INTERVAL_MAX - SLOW_SPAWN_INTERVAL_MIN)
        this.capsuleSpawnInterval = CAPSULE_SPAWN_INTERVAL_MIN + Math.random() * (CAPSULE_SPAWN_INTERVAL_MAX - CAPSULE_SPAWN_INTERVAL_MIN)
        this.henenySpawnInterval = HENEMY_SPAWN_INTERVAL_MIN + Math.random() * (HENEMY_SPAWN_INTERVAL_MAX - HENEMY_SPAWN_INTERVAL_MIN)
        this.score = 0
        this.finalScore = 0
        this.ship = new Ship(this.ctx, 150, 150)
        this.ship.groundTo(this.canvas.height)
        this.ship.visible = true
    }

    spawnEnemy() {
        const margin = enemyShip_width
        const x = Math.random() * (this.canvas.width - margin)
        const y = -enemyShip_height
        this.enemies.push(Enemy.createEnemyShip(this.ctx, x, y))
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    move() {
        if (!this.started || this.gameOver) return

        this.background.move()
        this.ship.move()
        this.checkBounds()

        const now = performance.now()
        if (now - this.lastSpawnTime > this.spawnInterval) {
            this.spawnEnemy()
            this.lastSpawnTime = now
            this.spawnInterval = 1500 + Math.random() * 1500
        }

        this.enemies.forEach((enemy) => enemy.move())
        this.enemies = this.enemies.filter(e => e.y < this.canvas.height + enemyShip_height)

        if (now - this.lastCapsuleSpawnTime > this.capsuleSpawnInterval) {
            this.spawnCapsule()
            this.lastCapsuleSpawnTime = now
            this.capsuleSpawnInterval = CAPSULE_SPAWN_INTERVAL_MIN + Math.random() * (CAPSULE_SPAWN_INTERVAL_MAX - CAPSULE_SPAWN_INTERVAL_MIN)
        }

        this.capsules.forEach((c) => c.move())
        this.capsules = this.capsules.filter(c => !c.collected && c.y < this.canvas.height + CAPSULE_H)

        if (now - this.lastSlowSpawnTime > this.slowSpawnInterval) {
            this.spawnSlow()
            this.lastSlowSpawnTime = now
            this.slowSpawnInterval = SLOW_SPAWN_INTERVAL_MIN + Math.random() * (SLOW_SPAWN_INTERVAL_MAX - SLOW_SPAWN_INTERVAL_MIN)
        }

        this.slows.forEach((s) => s.move())
        this.slows = this.slows.filter(s => !s.collected && s.y < this.canvas.height + SLOW_H)

        if (now - this.lastHenenySpawnTime > this.henenySpawnInterval) {
            this.spawnHenemy()
            this.lastHenenySpawnTime = now
            this.henenySpawnInterval = HENEMY_SPAWN_INTERVAL_MIN + Math.random() * (HENEMY_SPAWN_INTERVAL_MAX - HENEMY_SPAWN_INTERVAL_MIN)
        }

        this.henenemies.forEach((h) => h.move())
        this.henenemies = this.henenemies.filter(h => !h.destroyed && !h.isOutOfBounds(this.canvas.width))

        if (now - this.lastScoreTime >= 1000) {
            this.score += 10
            this.lastScoreTime = now
        }

        this.checkCollisions()
    }

    checkCollisions() {
        for (const enemy of this.enemies) {
            if (
                this.ship.x < enemy.x + enemy.w &&
                this.ship.x + this.ship.w > enemy.x &&
                this.ship.y < enemy.y + enemy.h &&
                this.ship.y + this.ship.h > enemy.y
            ) {
                this.gameOver = true
                this.ship.visible = false
                this.finalScore = this.score
                return
            }
        }

        for (const capsule of this.capsules) {
            if (
                this.ship.x < capsule.x + capsule.w &&
                this.ship.x + this.ship.w > capsule.x &&
                this.ship.y < capsule.y + capsule.h &&
                this.ship.y + this.ship.h > capsule.y
            ) {
                capsule.collected = true
                this.score += CAPSULE_SCORE
            }
        }

        for (const slow of this.slows) {
            const hb = 0.35
            const sx = slow.x + slow.w * hb
            const sy = slow.y + slow.h * hb
            const sw = slow.w * (1 - hb * 2)
            const sh = slow.h * (1 - hb * 2)
            if (
                this.ship.x < sx + sw &&
                this.ship.x + this.ship.w > sx &&
                this.ship.y < sy + sh &&
                this.ship.y + this.ship.h > sy
            ) {
                slow.collected = true
                this.ship.applySlow(SLOW_DURATION, SLOW_FACTOR)
            }
        }

        for (const henemy of this.henenemies) {
            if (
                this.ship.x < henemy.x + henemy.w &&
                this.ship.x + this.ship.w > henemy.x &&
                this.ship.y < henemy.y + henemy.h &&
                this.ship.y + this.ship.h > henemy.y
            ) {
                this.gameOver = true
                this.ship.visible = false
                this.finalScore = this.score
                return
            }
        }
    }

    spawnSlow() {
        const x = Math.random() * (this.canvas.width - SLOW_W)
        const y = -SLOW_H
        this.slows.push(Slow.create(this.ctx, x, y))
    }
 
    spawnHenemy() {
        if (Math.random() < 0.5) {
            this.henenemies.push(Henemy.createFromLeft(this.ctx, this.canvas.height))
        } else {
            this.henenemies.push(Henemy.createFromRight(this.ctx, this.canvas.width, this.canvas.height))
        }
    }
 

    spawnCapsule() {
        const x = Math.random() * (this.canvas.width - CAPSULE_W)
        const y = -CAPSULE_H
        this.capsules.push(Capsule.create(this.ctx, x, y))
    }

    checkBounds() {
        if (this.ship.x < 0) this.ship.x = 0
        if (this.ship.x + this.ship.w > this.canvas.width) this.ship.x = this.canvas.width - this.ship.w
        if (this.ship.y < 0) {
            this.ship.y = 0
            this.ship.vy = 1
        }
    }

    draw() {
        this.background.draw()

        if (this.started && !this.gameOver) {
            this.ship.draw()
        }

        if (this.started) {
            this.enemies.forEach((enemy) => enemy.draw())
            this.capsules.forEach((c) => c.draw())
            this.slows.forEach((s) => s.draw())
            this.henenemies.forEach((h) => h.draw())
        }

        if (!this.started) {
            this.drawWelcome()
        } else if (this.gameOver) {
            this.drawGameOver()
        } else {
            this.drawHUD()
        }
    }

    drawHUD() {
        const ctx = this.ctx
        ctx.save()
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.font = 'bold 22px Arial'
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#00cfff'
        ctx.shadowBlur = 12
        ctx.fillText(`SCORE: ${this.score}`, 16, 16)
        ctx.restore()
    }

    drawWelcome() {
        const ctx = this.ctx
        const cx = this.canvas.width / 2
        const cy = this.canvas.height / 2

        ctx.fillStyle = 'rgba(0, 0, 20, 0.75)'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.font = 'bold 52px Arial'
        ctx.fillStyle = '#00cfff'
        ctx.shadowColor = '#00cfff'
        ctx.shadowBlur = 25
        ctx.fillText('¡Bienvenido a una', cx, cy - 80)
        ctx.fillText('aventura en el espacio!', cx, cy - 20)

        const blink = Math.floor(performance.now() / 500) % 2 === 0
        if (blink) {
            ctx.font = '26px Arial'
            ctx.fillStyle = '#ffffff'
            ctx.shadowColor = '#ffffff'
            ctx.shadowBlur = 10
            ctx.fillText('Presiona la barra espaciadora para comenzar', cx, cy + 70)
        }

        ctx.restore()
    }

    drawGameOver() {
        const ctx = this.ctx
        const cx = this.canvas.width / 2
        const cy = this.canvas.height / 2

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.font = 'bold 72px Arial'
        ctx.fillStyle = '#ff2222'
        ctx.shadowColor = '#ff0000'
        ctx.shadowBlur = 30
        ctx.fillText('GAME OVER', cx, cy - 30)

        ctx.font = '28px Arial'
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = 10
        ctx.fillText('Tu nave fue destruida', cx, cy + 30)

        ctx.font = 'bold 32px Arial'
        ctx.fillStyle = '#00cfff'
        ctx.shadowColor = '#00cfff'
        ctx.shadowBlur = 20
        ctx.fillText(`SCORE FINAL: ${this.finalScore}`, cx, cy + 75)

        const blink = Math.floor(performance.now() / 500) % 2 === 0
        if (blink) {
            ctx.font = '22px Arial'
            ctx.fillStyle = '#ffdd00'
            ctx.shadowColor = '#ffdd00'
            ctx.shadowBlur = 15
            ctx.fillText('Pulsa ESPACIO para volver a intentarlo', cx, cy + 125)
        }

        ctx.restore()
    }
}