// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("Game");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.figurasContador = {
      diamond: 0,
      plastico: 0,
    };
    this.score = 0;
    this.maxY = this.player ? this.player.y : 0; // Se actualizará en create()
   
  }

  preload() {
    // load assets
    this.load.image("Cielo", "./public/assets/Cielo2.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.spritesheet("plastico3", "./public/assets/plastico.png", {
      frameWidth: 480,   // Cambia esto al ancho real de cada frame
      frameHeight: 600   // Cambia esto al alto real de cada frame
    });
    this.load.spritesheet("plastico", "./public/assets/plastico2.png", { 
      frameWidth: 600,   // Cambia esto al ancho real de cada frame
      frameHeight: 600  // Cambia esto al alto real de cada frame
    });
    this.load.spritesheet("plastico2", "./public/assets/plastico3.png", {
      frameWidth: 480,   // Cambia esto al ancho real de cada frame)
      frameHeight: 480   // Cambia esto al alto real de cada frame
    });
     this.load.spritesheet("beta4", "./public/assets/beta4.png", {
    frameWidth: 180,   // Cambia esto al ancho real de cada frame
    frameHeight: 200   // Cambia esto al alto real de cada frame
    });
    this.load.image('bullet', './public/assets/triangle.png');
    this.load.image('diamond', './public/assets/diamond.png');
    this.load.spritesheet("perdervidas", "./public/assets/Perdervida.png", {
      frameWidth: 64,   // Cambia esto al ancho real de cada frame
      frameHeight: 64   // Cambia esto al alto real de cada frame
    });
    this.load.image("corazon", "./public/assets/corazon2.png");
    this.load.spritesheet("red", "./public/assets/red.PNG", {
      frameWidth: 160,   // Cambia estos valores al tamaño de cada frame de tu spritesheet
      frameHeight: 14, // Cambia estos valores al tamaño de cada frame de tu spritesheet
    });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo
    this.add.image(width / 2, height / 2, "Cielo")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    if (!this.anims.exists('red_anim')) {
      this.anims.create({
        key: 'red_anim',
        frames: this.anims.generateFrameNumbers('red', { start: 0, end: 3 }),
        frameRate: 2,
        repeat: -1
      });
    }
    this.red = this.physics.add.staticSprite(960, 80, "red").setScale(12).refreshBody();
    this.red.anims.play('red_anim', true);

     // Jugador
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 3;
    this.player = this.physics.add.sprite(centerX, centerY, "beta4").setScale(1);
    this.player.setBounce(0.4);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(-250);
    this.player.setAccelerationX(1000);
    this.player.body.setMaxVelocity(2000, 1000);


    // Grupo de diamantes
    this.diamantes = this.physics.add.group();

    // Plásticos
    this.plasticos = this.physics.add.group();
    this.plasticos2= this.physics.add.group();
    this.plasticos3 = this.physics.add.group();

    // --- Configuración de los tres tipos de plástico ---
this.plasticoTypes = [
  { group: this.plasticos,  key: 'plastico',  anim: 'plastico_anim',  scale: 0.20, speed: -200 },
  { group: this.plasticos2, key: 'plastico2', anim: 'plastico_anim2', scale: 0.30, speed: -300 },
  { group: this.plasticos3, key: 'plastico3', anim: 'plastico_anim3', scale: 0.30, speed: -400 }
];

this.stage      = 0;   // 0 = plastico, 1 = plastico2, 2 = plastico3
this.spawned    = 0;   // cuántos se han generado en la fase actual
this.maxPerStage = 10; // plásticos antes de pasar al siguiente tipo

this.time.addEvent({
  delay: 3000,          // → cada 3 s (ajústalo a tu gusto)
  loop: true,
  callback: this.spawnPlastico,
  callbackScope: this
});



    // Colisiones
    this.physics.add.collider(this.player, this.red, this.gameOver, null, this);
    // Colisión entre jugador y plásticos
    this.physics.add.collider(this.player, this.plasticos, this.perderPuntos, null, this);
    this.physics.add.overlap(this.plasticos,this.red, this.perderPuntos, null, this);
     this.physics.add.collider(this.player, this.plasticos2, this.perderPuntos, null, this);
    this.physics.add.overlap(this.plasticos2,this.red, this.perderPuntos, null, this);
     this.physics.add.collider(this.player, this.plasticos3, this.perderPuntos, null, this);
    this.physics.add.overlap(this.plasticos3,this.red, this.perderPuntos, null, this);
    // Colisión entre jugador y diamantes rojos
    this.physics.add.overlap(this.player, this.diamantes, this.perderVida, null, this);


    this.cursors = this.input.keyboard.createCursorKeys();

    // Configurar el puntaje
    this.scoreText = this.add.text(5, 5, '0', {
      fontSize: '90px',
      fill: '#fff',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black' // O prueba con otra fuente ancha
    });

 this.vidas = 3; // O 5 si usas 5 corazones
    this.corazones = [];
    const corazonMargin = 55;
    const corazonSpacing = 200;
    for (let i = 0; i < this.vidas; i++) {
      const corazon = this.add.image(
        this.scale.width - corazonMargin - i * corazonSpacing,
        corazonMargin + 5,
        "corazon"
      ).setOrigin(0.5).setScale(3);
      this.corazones.push(corazon);
    }


    // // Variable para la velocidad inicial de las plataformas
    // this.platformSpeed = -50;

    //Disparos 
    this.bullets = this.physics.add.group();

    this.input.keyboard.on('keydown-SPACE', () => {
      const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
      bullet.setVelocityY(400); // Velocidad positiva: dispara hacia abajo
      bullet.body.allowGravity = false;
    });

    this.physics.add.overlap(this.bullets, this.plasticos, this.convertirEnDiamante, null, this);
    this.physics.add.overlap(this.bullets, this.plasticos2, this.convertirEnDiamante2, null, this);
    this.physics.add.overlap(this.bullets, this.plasticos3, this.convertirEnDiamante3, null, this);
    // Superposición para recolectar diamantes
    this.physics.add.overlap(this.player, this.diamantes, this.recolectarDiamante, null, this);
    
    // Animación nadar izquierda 
    if (!this.anims.exists('beta_left')) {
      this.anims.create({
        key: 'beta_left',
        frames: [{ key: 'beta4', frame: 2 }, { key: 'beta4', frame: 3 }],
        frameRate: 6,
        repeat: -1
      });
    }
    // Animación nadar derecha 
    if (!this.anims.exists('beta_right')) {
      this.anims.create({
        key: 'beta_right',
        frames: [{ key: 'beta4', frame: 4 }, { key: 'beta4', frame: 5 }],
        frameRate: 6,
        repeat: -1
      });
    }
    if (!this.anims.exists('beta_down')) {
      this.anims.create({
        key: 'beta_down',
        frames: [{ key: 'beta4', frame: 0 },{ key: 'beta4', frame: 1}], // Frame de reposo
        frameRate: 6,
        repeat: -1
      });
    }
    //  animación para plastico
    this.anims.create({
      key: 'plastico_anim',
      frames: this.anims.generateFrameNumbers('plastico', { start: 0, end: 3 }),
      frameRate: 4, // Velocidad de la animación
      repeat: -1
    });
  
    // animación para plastico2
    this.anims.create({
      key: 'plastico_anim2',
      frames: this.anims.generateFrameNumbers('plastico2', { start: 0, end: 0 }),
      frameRate: 4, // Velocidad de la animación
      repeat: -1
    });

    // animación perdervidas
   this.anims.create({
     key: 'perdervidas_anim',
     frames: this.anims.generateFrameNumbers('perdervidas', { start: 0, end: 4 }),
     frameRate: 5, // Velocidad de la animación
     repeat: -1
   });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-1000);
      this.player.anims.play('beta_left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(1000);
      this.player.anims.play('beta_right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('beta_down', true); // Cambia a la animación de reposo
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-100);
    }

    // Limitar al personaje para que no pase la mitad de la pantalla hacia abajo
    const mitadPantalla = this.scale.height / 2 -200;
    if (this.player.y > mitadPantalla) {
      this.player.y = mitadPantalla;
      this.player.setVelocityY(0);
    }
 }

  spawnPlastico() {
  // 1) Datos del tipo actual
  const t = this.plasticoTypes[this.stage];

  // 2) Crear el sprite
  const x = Phaser.Math.Between(50, this.scale.width - 50);
  const y = this.scale.height + 50;
  const plastico = t.group.create(x, y, t.key);

  plastico
    .setVelocityY(t.speed)
    .setScale(t.scale)
    .setOrigin(0.5);
  plastico.body.allowGravity = false;
  plastico.anims.play(t.anim, true);

  // 3) Contador
  this.spawned++;

  // 4) ¿Toca cambiar de fase?
  if (this.spawned >= this.maxPerStage && this.stage < this.plasticoTypes.length - 1) {
    this.spawned = 0;      // reinicia contador
    this.stage++;          // pasa al siguiente tipo
  }
}
spawnPlastico() {
  // ¿Hemos terminado las 3 fases secuenciales?
  const allPhasesDone = this.stage >= this.plasticoTypes.length;

  // ───────────────────────────────────────────────────────────────
  // 1) Generar plásticos
  // ───────────────────────────────────────────────────────────────
  if (!allPhasesDone) {
    // Fase normal → sólo 1 tipo
    this._crearPlastico(this.plasticoTypes[this.stage]);
    this.spawned++;

    // ¿Pasamos a la siguiente fase?
    if (this.spawned >= this.maxPerStage) {
      this.spawned = 0;
      this.stage++;
    }

  } else {
    // Fase “final” → todos los tipos a la vez
    this.plasticoTypes.forEach(cfg => this._crearPlastico(cfg));
  }
}

/* ----------------------------------------------------------------
   Función auxiliar que realmente instancia un plástico:
---------------------------------------------------------------- */
_crearPlastico(cfg) {
  const x = Phaser.Math.Between(50, this.scale.width - 50);
  const y = this.scale.height + 50;

  const p = cfg.group.create(x, y, cfg.key)
    .setVelocityY(cfg.speed)   // velocidad propia
    .setScale(cfg.scale)
    .setOrigin(0.5);

  p.body.allowGravity = false;
  p.anims.play(cfg.anim, true);
}

convertirEnDiamante(bullet, plastico) {
  if (!bullet.active || !plastico.active) return;   // ya se procesó

  bullet.disableBody(true, true);                   // inhabilita la bala
  plastico.disableBody(true, true);                 // inhabilita el plástico

  const diamante = this.diamantes.create(plastico.x, plastico.y, 'diamond');
  diamante.setVelocityY(-700);
  diamante.setScale(2); // Ajusta el tamaño del diamante si es necesario
  diamante.body.allowGravity = false;

  this.score += 200;
  this.scoreText.setText(this.score.toString());
}
convertirEnDiamante2(bullet, plastico2) {
  if (!bullet.active || !plastico2.active) return;   // ya se procesó

  bullet.disableBody(true, true);                   // inhabilita la bala
  plastico2.disableBody(true, true);                 // inhabilita el plástico

  const diamante = this.diamantes.create(plastico2.x, plastico2.y, 'diamond');
  diamante.setVelocityY(-500);
  diamante.setScale(2); // Ajusta el tamaño del diamante si es necesario
  diamante.body.allowGravity = false;

  this.score += 500;
  this.scoreText.setText(this.score.toString());
}
convertirEnDiamante3(bullet, plastico3) {
  if (!bullet.active || !plastico3.active) return;   // ya se procesó

  bullet.disableBody(true, true);                   // inhabilita la bala
  plastico3.disableBody(true, true);                 // inhabilita el plástico

  const diamante = this.diamantes.create(plastico3.x, plastico3.y, 'diamond');
  diamante.setVelocityY(-500);
  diamante.setScale(2); // Ajusta el tamaño del diamante si es necesario
  diamante.body.allowGravity = false;

  this.score += 1000;
  this.scoreText.setText(this.score.toString());
}
  recolectarDiamante(player, diamante) {
    diamante.destroy(); // Elimina el diamante recolectado
    this.score -= 200;   // resta puntos (ajusta el valor si quieres)
    // Opcional: actualiza el texto de puntaje en pantalla
    if (this.scoreText) {
      this.scoreText.setText('' + this.score);
    }
  }
  

perderVida(player, diamante) {
  // 1. Desactivar el diamante (evita dobles golpes)
  diamante.disableBody(true, true);

  // 2. Restar vida SOLO si aún hay
  if (this.vidas <= 0) return;
  this.vidas--;

  // 3. Sacar el sprite de corazón y reproducir animación
  const corazon = this.corazones.pop();
  if (corazon) {
    const { x, y } = corazon;   // guarda la posición ANTES de destruir
    corazon.destroy();

    const fx = this.add.sprite(x, y, 'perdervidas')
      .setOrigin(0.5)
      .setScale(3)
      .play('perdervidas_anim');

    this.time.delayedCall(1000, () => fx.destroy());
  }

  // 4. Fin de juego
  if (this.vidas === 0) this.gameOver();
}

  // Función para perder puntos
  perderPuntos(player, plastico,red) {
    this.score -= 1; // Resta puntos (ajusta el valor si quieres)
    if (this.score < 0) this.score = 0; // Evita puntaje negativo si lo deseas
    this.scoreText.setText('' + this.score);
  }

  // Función para ir a la pantalla de fin del juego
  gameOver() {
    console.log("GAME OVER");
    this.scene.start("findeljuego", { score: this.score }); // Pasa el puntaje
  }
}