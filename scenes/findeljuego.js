// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class findeljuego extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("findeljuego");
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
  }

  create(data) {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo de la escena
    this.add.image(width / 2, height / 2, "FondoMenu")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Mostrar el resultado
    const result = data.result === "win" ? "¡Ganaste!" : "Perdiste";
    this.add.text(width / 2, height / 2 - 150, result, {
      fontFamily: "PixelFont",
      fontSize: "64px",
      fill: "#000000",
    }).setOrigin(0.5);

    // Mostrar el puntaje final
    this.add.text(width / 2, height / 2 - 50, `Puntaje final: ${data.puntaje}`, {
      fontFamily: "PixelFont",
      fontSize: "32px",
      fill: "#000000",
    }).setOrigin(0.5);

    // Mostrar el contador de figuras
    const contadorText = `
    Diamantes: ${data.contador.diamond}
    Cuadrados: ${data.contador.cuadrado}
    Triángulos: ${data.contador.triangle}
  `;
    this.add.text(width / 2, height / 2 + 50, contadorText, {
      fontSize: "24px",
      fill: "#000000",
    }).setOrigin(0.5);

    // Instrucción para reiniciar
    this.add.text(width / 2, height / 2 + 200, "Presiona R para reiniciar", {
      fontFamily: "PixelFont",
      fontSize: "32px",
      fill: "#000000",
    }).setOrigin(0.5);

    // Reiniciar el juego al presionar "R"
    this.input.keyboard.once("keydown-R", () => {
      this.scene.start("Game");
    });
  }

  checkWinOrLose() {
    if (this.timeLeft <= 0) {
      if (this.score >= 100) {
        this.scene.start("findeljuego", { result: "win", contador: this.figurasContador, puntaje: this.score });
      } else {
        this.scene.start("findeljuego", { result: "lose", contador: this.figurasContador, puntaje: this.score });
      }
    }
  }
}