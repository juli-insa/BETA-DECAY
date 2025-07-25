// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class incio extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("incio");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("Cielo", "./public/assets/Cielo2.png");
    this.load.image("FLECHAS", "./public/assets/FLECHAS.png");
    this.load.image("SPACE", "./public/assets/SPACE.png");
    this.load.image("LOGO", "./public/assets/LOGO.png");
    this.load.spritesheet("beta4", "./public/assets/beta4.png", {
      frameWidth: 180,
      frameHeight: 200
    });
    this.load.image("bullet", "./public/assets/triangle.png");
    this.load.spritesheet("play", "./public/assets/play.png", {
      frameWidth: 360,
      frameHeight: 360
    });
    this.load.audio("sonidoDisparo", "./public/assets/disparo.mp3");
    this.load.audio("burbuja", "./public/assets/burbujavidaexplota.mp3");
  } // <-- aquí termina, no debe haber otra llave después
  
  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo de la escena
    this.add.image(width / 2, height / 2, "Cielo")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Animación de beta
    this.anims.create({
      key: 'betaAnim',
      frames: this.anims.generateFrameNumbers('beta4', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    // Sprite animado de beta en el centro
    this.player = this.physics.add.sprite(width / 2, height / 2, 'beta4')
      .setOrigin(0.5)
      .play('betaAnim');
    this.player.body.allowGravity = false; // <-- Desactiva la gravedad

    this.bullets = this.physics.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", this._shoot, this);
    this.sonidoDisparo = this.sound.add("sonidoDisparo");


    this.add.text(width / 2, height / 2 - 400, "¡Escapa de la red y elimina la basura!", {
      fontSize: '60px',
      fill: '#ffb6c1',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black', // O prueba con otra fuente ancha
      stroke: '#8B0000',           // Color del borde (rosa)
      strokeThickness: 10        // Grosor del borde
    }).setOrigin(0.5);


     this.add.text(width / 2, height / 2 - 320, "¡Cuidado con las burbujas rojas!", {
      fontSize: '60px',
      fill: '#ffb6c1',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black', // O prueba con otra fuente ancha
      stroke: '#8B0000',           // Color del borde (rosa)
      strokeThickness: 10        // Grosor del borde
    }).setOrigin(0.5);


    // // Imagen de las flechas con tinte blanco
    // this.add.text(width / 2, height / 2 - 150, "Prueba los controles", {
    //    fontSize: '60px',
    //   fill: '#000',
    //   fontStyle: 'bold', // Hace la letra más gruesa
    //   fontFamily: 'Arial Black' // O prueba con otra fuente ancha
    // }).setOrigin(0.5);


    // Centra ambas imágenes en la misma línea horizontal
    const yControles = height / 2 + 200;
    const espacio = width / 5; // Ajusta este valor para más o menos separación

    // Imagen de la barra espaciadora (a la izquierda del centro)
    this.imgSpace = this.add.image(width / 2 - espacio, yControles, "SPACE")
      .setOrigin(0.5)
      .setDisplaySize(width / 4, height / 6);

    // Imagen de las flechas (a la derecha del centro)
    this.imgFlechas = this.add.image(width / 2 + espacio, yControles, "FLECHAS")
      .setOrigin(0.5)
      .setDisplaySize(width / 6, height / 4)
      .setTint(0x00cfff);
       // Texto de instrucciones (en el centro)
      this.txtControles = this.add.text(width / 2, height / 2 - 20, "Disparar                       Moverse", {
       fontSize: '60px',
      fill: '#00cfff',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black', // O prueba con otra fuente ancha
       stroke: '#000',
      strokeThickness: 10        // Grosor del borde
    }).setOrigin(0.5);


 this.anims.create({
  key: 'playAnim',
  frames: this.anims.generateFrameNumbers('play', { start: 0, end: 5 }),
  frameRate: 10,
  repeat: 0 // no repetir la animación
});
   
  // Botón de Play
const playButton = this.add.sprite(width / 2, height / 2 + 400, 'play')
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true });
   this.sonidoburbuja = this.sound.add("burbuja");

// Al hacer clic, se reproduce la animación y luego cambia de escena
playButton.on('pointerdown', () => {
  playButton.play('playAnim');

  // Esperar a que termine la animación
  playButton.once('animationcomplete', () => {
    this.scene.start("Game");
  });
});

// Animación quieto (usa dos frames: 0 y 1)
this.anims.create({
  key: 'betaIdle',
  frames: this.anims.generateFrameNumbers('beta4', { start: 0, end: 1 }),
  frameRate:6,
  repeat: -1
});

// Animación derecha
this.anims.create({
  key: 'betaRight',
  frames: this.anims.generateFrameNumbers('beta4', { start: 4, end: 5 }),
  frameRate: 6,
  repeat: -1
});

// Animación izquierda
this.anims.create({
  key: 'betaLeft',
  frames: this.anims.generateFrameNumbers('beta4', { start: 2, end: 3 }),
  frameRate: 6,
  repeat: -1
});

// Guarda la referencia al texto "Prueba los controles"
this.txtPrueba = this.add.text(width / 2, height / 2 - 150, "Prueba los controles", {
  fontSize: '60px',
  fill: '#00cfff',
  fontStyle: 'bold',
  fontFamily: 'Arial Black',
  stroke: '#000',
   strokeThickness: 10        // Grosor del borde
}).setOrigin(0.5);


    // Evento para ocultar al presionar SPACE o flechas izquierda/derecha
    const ocultarControles = () => {
      this.imgSpace.setVisible(false);
      this.imgFlechas.setVisible(false);
      this.txtControles.setVisible(false);
      this.txtPrueba.setVisible(false); // Oculta también este texto
    };

    this.input.keyboard.on("keydown-SPACE", ocultarControles);
    this.input.keyboard.on("keydown-LEFT", ocultarControles);
    this.input.keyboard.on("keydown-RIGHT", ocultarControles);
}

_shoot() {
  // Disparo hacia abajo desde beta
  const bala = this.bullets.create(this.player.x, this.player.y, "bullet");
  bala.setVelocityY(400).body.allowGravity = false;
  if (this.sonidoDisparo) this.sonidoDisparo.play();
}

  update() {
  // Movimiento horizontal con las flechas
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-1000);
    this.player.anims.play('betaLeft', true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(1000);
    this.player.anims.play('betaRight', true);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play('betaIdle', true);
  }
  this.player.setVelocityY(0); // <-- Mantiene la posición vertical fija
  // ...otros efectos o sonidos...
   if (this.sonidoburbuja) this.sonidoburbuja.play();
}


  
  // other methods
  // for example, to create animations, groups, etc.
}