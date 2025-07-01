// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/


export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");

    /**
     * Configuración centralizada de cada tipo de plástico.
     * Si quieres añadir más, sólo agrega otro objeto aquí y NO tendrás que tocar el resto del código.
     */
    this.PLASTICO_CONFIG = [
      { key: "plastico",  anim: "plastico_anim",  scale: 0.20, speed: -200, score: 200   },
      { key: "plastico2", anim: "plastico_anim2", scale: 0.30, speed: -300, score: 500   },
      { key: "plastico3", anim: "plastico_anim3", scale: 0.30, speed: -400, score: 1000  }
    ];

    // Parámetros de progresión
    this.stage = 0;           // índice de la fase actual
    this.spawned = 0;         // plásticos generados en esta fase
    this.maxPerStage = 10;    // plásticos antes de pasar a la siguiente fase
  }

  /* ------------------------------------------------------------------
   *  PRELOAD
   *  ----------------------------------------------------------------*/
  preload() {
    this.load.image("Cielo", "./public/assets/Cielo2.png");
    this.load.image("platform", "./public/assets/platform.png");

    // Cargamos los 3 tipos de plásticos
    this.load.spritesheet("plastico3", "./public/assets/plastico.png",  { frameWidth: 480, frameHeight: 600 });
    this.load.spritesheet("plastico",  "./public/assets/plastico2.png", { frameWidth: 600, frameHeight: 600 });
    this.load.spritesheet("plastico2", "./public/assets/plastico3.png", { frameWidth: 480, frameHeight: 480 });

    this.load.spritesheet("beta4", "./public/assets/beta4.png", {
      frameWidth: 180,
      frameHeight: 200
    });

    this.load.image("bullet", "./public/assets/triangle.png");
    this.load.image("diamond", "./public/assets/diamond.png");

    this.load.spritesheet("perdervidas", "./public/assets/Perdervida.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.image("corazon", "./public/assets/corazon2.png");

    this.load.spritesheet("red", "./public/assets/red.PNG", {
      frameWidth: 160,
      frameHeight: 14
    });

    this.load.audio("sonidoDisparo", "./public/assets/disparo.mp3");
    this.load.audio("burbuja", "./public/assets/burbujavidaexplota.mp3");

  }

  /* ------------------------------------------------------------------
   *  CREATE
   *  ----------------------------------------------------------------*/
  create() {
    // Reiniciar progreso de fases al reiniciar la escena
    this.stage = 0;
    this.spawned = 0;

    /* ★★★ 1. ESCENA BÁSICA ★★★ */
    this.add.image(this.scale.width / 2, this.scale.height / 2, "Cielo")
        .setOrigin(0.5).setDisplaySize(this.scale.width, this.scale.height);

    this._createRedBar();
    this._createPlayer();

    /* ★★★ 2. GRUPOS ★★★ */
    this.diamantes = this.physics.add.group();
    this.bullets   = this.physics.add.group();

    // Creamos un grupo por cada tipo de plástico usando la configuración
    this.PLASTICO_CONFIG.forEach(cfg => cfg.group = this.physics.add.group());

    /* ★★★ 3. ANIMACIONES (crear si no existen) ★★★ */
    this._ensureAnim("beta_left",  [{ key: "beta4", frame: 2 }, { key: "beta4", frame: 3 }]);
    this._ensureAnim("beta_right", [{ key: "beta4", frame: 4 }, { key: "beta4", frame: 5 }]);
    this._ensureAnim("beta_down",  [{ key: "beta4", frame: 0 }, { key: "beta4", frame: 1 }]);

    this._ensureAnim("plastico_anim",  this.anims.generateFrameNumbers("plastico",  { start: 0, end: 3 }));
    this._ensureAnim("plastico_anim2", this.anims.generateFrameNumbers("plastico2", { start: 0, end: 0 }));
    this._ensureAnim("plastico_anim3", this.anims.generateFrameNumbers("plastico3", { start: 0, end: 3 }));
    this._ensureAnim("perdervidas_anim", this.anims.generateFrameNumbers("perdervidas", { start: 0, end: 4 }), 5, 0);

    /* ★★★ 4. UI (score + corazones) ★★★ */
    this._createScore();
    this._createLives(3);

    /* ★★★ 5. CONTROLES ★★★ */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", this._shoot, this);
     this.sonidoDisparo = this.sound.add("sonidoDisparo");
  // ...existing code...
    /* ★★★ 6. PHYSICS COLLIDERS ★★★ */
    // Jugador vs red bar = Game Over
    this.physics.add.collider(this.player, this.red, this.gameOver, null, this);

    // Jugador vs plásticos → perderPuntos
    this.PLASTICO_CONFIG.forEach(cfg => {
      this.physics.add.collider(this.player, cfg.group, this.perderPuntos, null, this);
      this.physics.add.overlap(cfg.group, this.red, this.perderPuntos, null, this);
      this.physics.add.overlap(this.bullets, cfg.group, this.convertirEnDiamante, null, this);
    });

    // Jugador vs diamantes → perderVida
    this.physics.add.overlap(this.player, this.diamantes, this.perderVida, null, this);

    /* ★★★ 7. TIMERS ★★★ */
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.spawnPlastico,
      callbackScope: this
    });

    this.juegoActivo = false;
    this._startCountdown();
  }

  _startCountdown() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    let count = 3;
    const countdownText = this.add.text(centerX, centerY, count, {
      fontSize: "200px",
      fill: "#00ffff", // ← color cyan
      fontStyle: "bold",
      fontFamily: "Arial Black"
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      repeat: 3,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(count);
        } else if (count === 0) {
          countdownText.setText("¡YA!");
        } else {
          countdownText.destroy();
          this.juegoActivo = true; // ¡Ahora sí empieza el juego!
          this.spawnPlastico();    // ← Genera el primer plástico justo después del "¡YA!"
        }
      }
    });
  }

  /* ------------------------------------------------------------------
   *  UPDATE LOOP
   *  ----------------------------------------------------------------*/
  update() {
    if (!this.juegoActivo) {
      // Mantener player completamente quieto y con animación "down"
      if (this.player) {
        this.player.setVelocity(0, 0);
        this.player.anims.play("beta_down", true);
      }
      return;
    }

    const { left, right, up } = this.cursors;
    if (left.isDown)  { this.player.setVelocityX(-1000).anims.play("beta_left", true); }
    else if (right.isDown) { this.player.setVelocityX(1000).anims.play("beta_right", true); }
    else { this.player.setVelocityX(0).anims.play("beta_down", true); }

    if (up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-100);
    }

    // Limitar player para que no baje de cierta altura
    const limite = this.scale.height / 2 - 200;
    if (this.player.y > limite) {
      this.player.y = limite;
      this.player.setVelocityY(0);
    }
  }

  /* ------------------------------------------------------------------
   *  SPAWN / SHOOT LOGIC
   *  ----------------------------------------------------------------*/
  spawnPlastico() {
    if (!this.juegoActivo) return; // No spawnea plásticos hasta que termine el 3-2-1

    // Si aún estamos en las fases secuenciales
    if (this.stage < this.PLASTICO_CONFIG.length) {
      this._crearPlastico(this.PLASTICO_CONFIG[this.stage]);
      if (++this.spawned >= this.maxPerStage) { this.spawned = 0; this.stage++; }
    } else {
      // Fase final → todos los tipos
      this.PLASTICO_CONFIG.forEach(cfg => this._crearPlastico(cfg));
    }
  }

  _crearPlastico(cfg) {
    // Obtener ancho real del sprite (frame) y aplicar escala
    const frame = this.textures.get(cfg.key).getSourceImage();
    const spriteWidth = frame.width * cfg.scale;
    const minX = spriteWidth / 2;
    const maxX = this.scale.width - spriteWidth / 2;

    const x = Phaser.Math.Between(minX, maxX);
    const y = this.scale.height + 50;
    const p = cfg.group.create(x, y, cfg.key)
      .setVelocityY(cfg.speed)
      .setScale(cfg.scale)
      .setOrigin(0.5);

    p.body.allowGravity = false;
    p.anims.play(cfg.anim, true);
  }

  _shoot() {
    const bala = this.bullets.create(this.player.x, this.player.y, "bullet");
    bala.setVelocityY(400).body.allowGravity = false;
    if (this.sonidoDisparo) this.sonidoDisparo.play();
  }

  convertirEnDiamante(bullet, plastico) {
    if (!bullet.active || !plastico.active) return;
    bullet.disableBody(true, true);
    plastico.disableBody(true, true);

    const cfg = this.PLASTICO_CONFIG.find(c => c.key === plastico.texture.key) || { score: 200 };

    const diamante = this.diamantes.create(plastico.x, plastico.y, "diamond")
      .setVelocityY(-700)
      .setScale(2);
    diamante.body.allowGravity = false;

    this._addScore(cfg.score);
  }

  /* ------------------------------------------------------------------
   *  SCORE / LIVES / GAME OVER
   *  ----------------------------------------------------------------*/
  _createScore() {
    this.score = 0;
    this.scoreText = this.add.text(5, 5, "0", {
      fontSize: "90px",
      fill: "#00ffff", // ← color cyan
      fontStyle: "bold",
      fontFamily: "Arial Black"
    });
  }

  _addScore(pts) {
    this.score += pts;
    this.scoreText.setText(this.score.toString());
  }

  _createLives(num) {
    this.vidas = num;
    this.corazones = [];
    const margin = 55;
    const spacing = 200;
    for (let i = 0; i < num; i++) {
      const x = this.scale.width - margin - i * spacing;
      const y = margin + 5;
      this.corazones.push(this.add.image(x, y, "corazon").setScale(3).setOrigin(0.5));
      
    }
  }

  perderPuntos() {
    this._addScore(-1);
    if (this.score < 0) { this.score = 0; this.scoreText.setText("0"); }
  }

  perderVida(_player, diamante) {
    diamante.disableBody(true, true);
    if (this.vidas <= 0) return;

    this.vidas--;
    const corazon = this.corazones.pop();
    if (corazon) {
      const { x, y } = corazon;
      corazon.destroy();
      const fx = this.add.sprite(x, y, "perdervidas").setScale(3).play("perdervidas_anim");
      this.time.delayedCall(1000, () => fx.destroy());
      this.sonidoburbuja = this.sound.add("burbuja");
    }
    if (this.sonidoburbuja) this.sonidoburbuja.play();
    if (this.vidas === 0) this.gameOver();
  }

  gameOver() { this.scene.start("findeljuego", { score: this.score }); }

  /* ------------------------------------------------------------------
   *  HELPERS
   *  ----------------------------------------------------------------*/
  _createRedBar() {
    if (!this.anims.exists("red_anim")) {
      this.anims.create({ key: "red_anim", frames: this.anims.generateFrameNumbers("red", { start: 0, end: 3 }), frameRate: 2, repeat: -1 });
    }
    this.red = this.physics.add.staticSprite(960, 80, "red").setScale(12).refreshBody();
    this.red.anims.play("red_anim", true);
  }

  _createPlayer() {
    const playerX = this.scale.width / 2;
    const playerY = this.scale.height / 3;
    this.player = this.physics.add.sprite(playerX, playerY, "beta4").setScale(1)
      .setBounce(0.4).setCollideWorldBounds(true);
    this.player.body
      .setGravityY(-250)
      .setAccelerationX(0)
      .setMaxVelocity(2000, 2000);
  }

  _ensureAnim(key, frames, frameRate = 6, repeat = -1) {
    if (this.anims.exists(key)) return;
    this.anims.create({ key, frames, frameRate, repeat });
  }
}
