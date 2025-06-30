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
    this.load.image("beta2", "./public/assets/beta2.png");
     this.load.image("LOGO", "./public/assets/LOGO.png");
     this.load.spritesheet("LOGOANIM", "./public/assets/LOGOANIM.png", {
      frameWidth: 384,
      frameHeight: 216
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
  .setScale(5); // Ajusta el tamaño del logo

    // Inicia la animación del logo
   logoSprite.play('logoAnim', true);
    

    // Botón de Play (texto interactivo)
    const playButton = this.add.text(width / 2, height / 2 + 450, "▶", {
      fontSize: '80px',
      fill: '#00cfff',
      fontStyle: 'bold',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Cambia de escena al hacer clic
    playButton.on('pointerdown', () => {
      this.scene.start("incio");
    });

    // Opcional: efecto hover
    playButton.on('pointerover', () => playButton.setStyle({ fill: '#fff' }));
    playButton.on('pointerout', () => playButton.setStyle({ fill: '#00cfff' }));
  }
}