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
    this.load.image("Cielo", "./public/assets/Cielo.PNG");
    this.load.image("beta2", "./public/assets/beta2.png");
     this.load.image("LOGO", "./public/assets/LOGO.png");
  }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo de la escena
    this.add.image(width / 2, height / 2, "Cielo")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    this.add.image(width / 2, height / 2 - 100, "beta2") 
      .setOrigin(0.5)
      .setScale(0.5); // Cambia 0.5 por el factor de escala que desees


      // Logo del juego
    this.add.image(width / 2, height / 2 - -200, "LOGO")
      .setOrigin(0.5)
      .setDisplaySize(width / 2 , height / 3);

    // // Título del juego con mejor tipografía y color
    // const title = this.add.text(width / 2, height / 2 - -100, "BETA DECAY", {
    //   fontSize: "80px",
    //   fill: "#00cfff",// color del texto
    //   stroke: "#505050", // Contorno gris
    //   strokeThickness: 6, // Grosor del contorno
    //   shadow: {
    //     offsetX: 4, // Sombra en el eje X
    //     offsetY: 4, // Sombra en el eje Y
    //     color: "#303030", // Color de la sombra
    //     blur: 2, // Desenfoque de la sombra
    //     stroke: true, // Aplicar sombra al contorno
    //     fill: true, // Aplicar sombra al relleno
    //   },
    // }).setOrigin(0.5);


    // // Instrucciones para jugar
    // this.add.text(width / 2, height / 2 + 500, "Presiona ENTER para iniciar", {
    //   fontSize: '60px',
    //   fill: '#00cfff',
    //   fontStyle: 'bold', // Hace la letra más gruesa
    //   fontFamily: 'Arial Black' // O prueba con otra fuente ancha
    // }).setOrigin(0.5);

    // // Iniciar el juego al presionar "ENTER"
    // this.input.keyboard.once("keydown-ENTER", () => {
    //   this.scene.start("incio"); // Cambia a la escena de inicio
    // });

    // Botón de Play (texto interactivo)
    const playButton = this.add.text(width / 2, height / 2 + 450, "▶ JUGAR", {
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