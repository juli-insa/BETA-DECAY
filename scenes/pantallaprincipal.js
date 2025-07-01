// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class pantallaprincipal extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("pantallaprincipal");
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
     this.load.image("LOGO", "./public/assets/LOGO.png");
     this.load.spritesheet("LOGOANIM", "./public/assets/LOGOANIM.png", {
      frameWidth: 384,
      frameHeight: 216
     });
     this.load.spritesheet("play", "./public/assets/play.png", {
      frameWidth: 360,
      frameHeight: 360
     });
    }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;

     
    // Animación del logo
      if (!this.anims.exists('logoAnim')) {
    this.anims.create({ 
      key: 'logoAnim',
      frames: this.anims.generateFrameNumbers('LOGOANIM', { start: 0, end: 35 }), 
      frameRate: 8,
      repeat: 0 // Repite indefinidamente
    });
  }
   // Fondo de la escena
     this.add.image(width / 2, height / 2, "Cielo")
       .setOrigin(0.5)
       .setDisplaySize(width, height);

   const logoSprite = this.add.sprite(width / 2, height / 2 - 200, 'LOGOANIM')
  .setOrigin(0.5)
  .setScale(4,5); // Ajusta el tamaño del logo

    // Inicia la animación del logo
   logoSprite.play('logoAnim', true);
    
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
    this.scene.start("incio");
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
