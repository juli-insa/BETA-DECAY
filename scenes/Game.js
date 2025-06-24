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
    this.load.image("Cielo", "assets/Cielo.PNG");
    this.load.image("FondoMenu", "./public/assets/FondoMenu.jpg");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("plastico", "./public/assets/plastico.png");
    // this.load.spritesheet("beta", "./public/assets/beta.PNG", {
    //   frameWidth: 640,   // Cambia esto al ancho real de cada frame
    //   frameHeight: 356   // Cambia esto al alto real de cada frame
    // });
    // this.load.spritesheet("beta3", "./public/assets/beta3.png", {
    // frameWidth: 480,   // Cambia esto al ancho real de cada frame
    // frameHeight: 600   // Cambia esto al alto real de cada frame
    // });
     this.load.spritesheet("beta4", "./public/assets/beta4.png", {
    frameWidth: 180,   // Cambia esto al ancho real de cada frame
    frameHeight: 200   // Cambia esto al alto real de cada frame
    });
    this.load.image('bullet', './public/assets/triangle.png');
    this.load.image('diamond', './public/assets/diamond.png');
    this.load.image("corazon", "./public/assets/corazon.png");
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
    this.player = this.physics.add.sprite(centerX, centerY, "beta4").setScale(0.7);
    this.player.setBounce(0.4);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(-250);

    this.maxY = this.player.y; // <-- Agrega esto aquí

    // Plataformas móviles
    this.movingPlatforms = this.physics.add.group();
     // Evento para crear plataformas cada 2 segundos
    this.time.addEvent({
      delay: 2000, // milisegundos (2 segundos)
      callback: () => {
        // Posición X aleatoria dentro de los límites del juego
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = this.scale.height + 50; // Aparecen justo debajo de la pantalla
        let platform = this.movingPlatforms.create(x, y, "platform");
        platform.setVelocityY(-250); // Hacia arriba
        platform.body.allowGravity = false;
      },
      callbackScope: this,
      loop: true
    });
    

    // Plásticos
    this.plasticos = this.physics.add.group();

    // Evento para crear plásticos cada 3 segundos
    this.time.addEvent({
      delay: 3000, // milisegundos (3 segundos)
      callback: () => {
        // Posición X aleatoria dentro de los límites del juego
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = this.scale.height + 50; // Aparecen justo debajo de la pantalla
        let plastico = this.plasticos.create(x, y, "plastico");
        plastico.setVelocityY(-100); // Hacia arriba
        plastico.body.allowGravity = false;
      },
      callbackScope: this,
      loop: true
    });

    // Colisiones
    this.physics.add.collider(this.player, this.red, this.gameOver, null, this);
    this.physics.add.collider(this.player, this.movingPlatforms);
    // Colisión entre jugador y plásticos
    this.physics.add.overlap(this.player, this.plasticos, this.perderPuntos, null, this);


    this.cursors = this.input.keyboard.createCursorKeys();

    // Configurar el puntaje
    this.scoreText = this.add.text(2, 2, 'Puntaje: 0', {
      fontSize: '60px',
      fill: '#fff',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black' // O prueba con otra fuente ancha
    });

 this.vidas = 3; // O 5 si usas 5 corazones
    this.corazones = [];
    const corazonMargin = 35;
    const corazonSpacing = 100;
    for (let i = 0; i < this.vidas; i++) {
      const corazon = this.add.image(
        this.scale.width - corazonMargin - i * corazonSpacing,
        corazonMargin + 5,
        "corazon"
      ).setOrigin(0.5).setScale(0.2);
      this.corazones.push(corazon);
    }

    // Variable para la velocidad inicial de las plataformas
    this.platformSpeed = -50;

    //Disparos 
    this.bullets = this.physics.add.group();

    this.input.keyboard.on('keydown-SPACE', () => {
      const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
      bullet.setVelocityY(300); // Velocidad positiva: dispara hacia abajo
      bullet.body.allowGravity = false;
    });

    this.physics.add.overlap(this.bullets, this.plasticos, this.convertirEnDiamante, null, this);

    this.diamantes = this.physics.add.group();

    // Superposición para recolectar diamantes
    this.physics.add.overlap(this.player, this.diamantes, this.recolectarDiamante, null, this);
    
    // Animación caminar izquierda (fila de arriba)
    if (!this.anims.exists('beta_left')) {
      this.anims.create({
        key: 'beta_left',
        frames: [{ key: 'beta4', frame: 2 }, { key: 'beta4', frame: 3 }],
        frameRate: 4,
        repeat: -1
      });
    }
    // Animación caminar derecha (fila de abajo)
    if (!this.anims.exists('beta_right')) {
      this.anims.create({
        key: 'beta_right',
        frames: [{ key: 'beta4', frame: 4 }, { key: 'beta4', frame: 5 }],
        frameRate: 4,
        repeat: -1
      });
    }
    if (!this.anims.exists('beta_down')) {
      this.anims.create({
        key: 'beta_down',
        frames: [{ key: 'beta4', frame: 0 },{ key: 'beta4', frame: 1}], // Frame de reposo
        frameRate: 4,
        repeat: -1
      });
    }
  }


  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-500);
      this.player.anims.play('beta_left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(500);
      this.player.anims.play('beta_right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('beta_down', true); // Cambia a la animación de reposo
      // Frame de reposo: 0 para izquierda, 3 para derecha (puedes guardar la última dirección)
      // this.player.anims.stop();
      // this.player.setFrame(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-100);
    }

    // Ganar puntos automáticamente al bajar
    if (this.player.y > this.maxY) {
      this.score += Math.floor(this.player.y - this.maxY);
      this.maxY = this.player.y;
      this.scoreText.setText('Puntaje: ' + this.score);
    }

    // Si el jugador toca la parte de abajo de la pantalla, pierde una vida
    if (this.player.y + this.player.displayHeight / 2 >= this.scale.height) {
      if (this.vidas > 0) {
        this.vidas--;
        // Oculta un corazón visualmente
        if (this.corazones[this.vidas]) {
          this.corazones[this.vidas].setVisible(false);
        }
      }
      // Reinicia posición del jugador
      this.player.x = this.scale.width / 2;
      this.player.y = this.scale.height / 3;
      this.player.setVelocity(0, 0);
      this.maxY = this.player.y;
      // Si ya no hay vidas, termina el juego
      if (this.vidas <= 0) {
        this.gameOver();
      }
    }

    // Limitar al personaje para que no pase la mitad de la pantalla hacia abajo
    const mitadPantalla = this.scale.height / 2 +200;
    if (this.player.y > mitadPantalla) {
      this.player.y = mitadPantalla;
      this.player.setVelocityY(0);
    }
  }


  convertirEnDiamante(bullet, plastico) {
    bullet.destroy(); // Destruye la bala
    // Crea un diamante en la posición del plástico
    const diamante = this.diamantes.create(plastico.x, plastico.y, 'diamond');
    diamante.setVelocityY(plastico.body.velocity.y); // Mantiene la velocidad
    diamante.body.allowGravity = false;
    plastico.destroy(); // Elimina el plástico original
  }

  recolectarDiamante(player, diamante) {
    diamante.destroy(); // Elimina el diamante recolectado
    this.score += 100;   // Suma puntos (ajusta el valor si quieres)
    // Opcional: actualiza el texto de puntaje en pantalla
    if (this.scoreText) {
      this.scoreText.setText('Puntaje: ' + this.score);
    }
  }

  // // Función para recolectar diamantes
  // recolectarDiamante(player, diamante) {
  //   diamante.destroy(); // Elimina el diamante recolectado
  //   this.score += 10;   // Suma puntos
  //   this.scoreText.setText('Puntaje: ' + this.score); // Actualiza el puntaje
  // }

  // Función para perder puntos
  perderPuntos(player, plastico) {
    this.score -= 1; // Resta puntos (ajusta el valor si quieres)
    if (this.score < 0) this.score = 0; // Evita puntaje negativo si lo deseas
    this.scoreText.setText('Puntaje: ' + this.score);
    // Opcional: puedes destruir el plástico si quieres
    // plastico.destroy();
  }

  // Función para ir a la pantalla de fin del juego
  gameOver() {
    console.log("GAME OVER");
    this.scene.start("findeljuego", { score: this.score }); // Pasa el puntaje
  }
}