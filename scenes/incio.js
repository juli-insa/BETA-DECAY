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
      this.load.image("FondoMenu", "./public/assets/FondoMenu.jpg");
      this.load.image("FLECHAS", "./public/assets/FLECHAS.png");
    }
    create() {
      const width = this.scale.width;
      const height = this.scale.height;
  
      // Fondo de la escena
      this.add.image(width / 2, height / 2, "FondoMenu")
        .setOrigin(0.5)
        .setDisplaySize(width, height);
  
      // Título del juego con mejor tipografía y color
      const title = this.add.text(width / 2, height / 2 - 150, "Ninja Moncho", {
        fontFamily: "PixelFont", // Fuente personalizada
        fontSize: "64px",
        fill: "#ffcc00", // Color del texto
        stroke: "#505050", // Contorno gris
        strokeThickness: 6, // Grosor del contorno
        shadow: {
          offsetX: 4, // Sombra en el eje X
          offsetY: 4, // Sombra en el eje Y
          color: "#303030", // Color de la sombra
          blur: 2, // Desenfoque de la sombra
          stroke: true, // Aplicar sombra al contorno
          fill: true, // Aplicar sombra al relleno
        },
      }).setOrigin(0.5);

      this.add.text (width / 2, height / 2 - 80, "¡Junta las formas y obten 100 puntos!", {
        fontFamily: "PixelFont",
        fontSize: "40px",
        fill: "#ffcc00",
        stroke: "#505050", // Contorno gris
        strokeThickness: 3, // Grosor del contorno
      }).setOrigin(0.5);


      // Imagen de las flechas con tinte blanco
      this.add.text(width / 2, height / 2 - 5, "Controles", {
        fontFamily: "PixelFont",
        fontSize: "32px",
        fill: "#ffcc00",
        stroke: "#505050", // Contorno gris
        strokeThickness: 3, // Grosor del contorno
      }).setOrigin(0.5);
      this.add.image(width / 2, height / 2 + 80, "FLECHAS")
        .setOrigin(0.5)
        .setDisplaySize(width / 4, height / 4)
        .setTint(0x303030); // Aplicar color blanco
  
      // Instrucciones para jugar
      this.add.text(width / 2, height / 2 + 200, "Presiona I para iniciar", {
        fontFamily: "PixelFont",
        fontSize: "40px",
        fill: "#ffcc00",
        stroke: "#505050", // Contorno gris
        strokeThickness: 3, // Grosor del contorno
      }).setOrigin(0.5);
  
      // Iniciar el juego al presionar "I"
      this.input.keyboard.once("keydown-I", () => {
        this.scene.start("Game");
      });
    }
}