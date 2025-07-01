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
   this.load.spritesheet("play", "./public/assets/play.png", {
      frameWidth: 360,
      frameHeight: 360
     });
    }
  
  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo de la escena
    this.add.image(width / 2, height / 2, "Cielo")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // // Logo del juego
    // this.add.image(width / 2, height / 2 - 350, "LOGO")
    //   .setOrigin(0.5)
    //   .setDisplaySize(width / 2, height / 3);


    this.add.text(width / 2, height / 2 - 300, "¡Escapa de la red y elimina la basura!", {
      fontSize: '60px',
      fill: '#00cfff',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black' // O prueba con otra fuente ancha
    }).setOrigin(0.5);


    // Imagen de las flechas con tinte blanco
    this.add.text(width / 2, height / 2 - 50, "Controles", {
       fontSize: '60px',
      fill: '#000',
      fontStyle: 'bold', // Hace la letra más gruesa
      fontFamily: 'Arial Black' // O prueba con otra fuente ancha
    }).setOrigin(0.5);


    // Centra ambas imágenes en la misma línea horizontal
    const yControles = height / 2 + 200;
    const espacio = width / 8; // Separación entre imágenes

    // Imagen de la barra espaciadora (a la izquierda)
    this.add.image(width / 2 - espacio, yControles, "SPACE")
      .setOrigin(0.5)
      .setDisplaySize(width / 4, height / 6);

    // Imagen de las flechas (a la derecha)
    this.add.image(width / 2 + espacio, yControles, "FLECHAS")
      .setOrigin(0.5)
      .setDisplaySize(width / 6, height / 4)
      .setTint(0x00cfff);

 this.anims.create({
  key: 'playAnim',
  frames: this.anims.generateFrameNumbers('play', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: 0 // no repetir la animación
});
   
  // Botón de Play
const playButton = this.add.sprite(width / 2, height / 2 + 400, 'play')
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true });

// Al hacer clic, se reproduce la animación y luego cambia de escena
playButton.on('pointerdown', () => {
  playButton.play('playAnim');

  // Esperar a que termine la animación
  playButton.once('animationcomplete', () => {
    this.scene.start("Game");
  });
});
}


  update() {
    // update logic
    // this is called every frame
  }

  // other methods
  // for example, to create animations, groups, etc.
}