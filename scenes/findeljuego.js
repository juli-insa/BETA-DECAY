// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class findeljuego extends Phaser.Scene {
  constructor() {
    super("findeljuego");
  }

  init(data) {
    this.finalScore = data.score || 0; // Recibe el puntaje
  }

  preload() {
    // load assets
    this.load.image("Cielo", "./public/assets/Cielo.PNG");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo de la escena
    this.add.image(width / 2, height / 2, "Cielo")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Obtener el puntaje más alto guardado
    const highScore = parseInt(localStorage.getItem('highScore')) || 0;

    // Si el puntaje actual es mayor, actualizar el high score
    if (this.finalScore > highScore) {
      localStorage.setItem('highScore', this.finalScore);
    }

    // Mostrar el puntaje final
    this.add.text(width / 2, height / 2 - 50, `Puntaje final: ${this.finalScore}`, {
      fontSize: '60px',
      fill: '#fff',
      fontStyle: 'bold',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    // Mostrar el puntaje más alto
    this.add.text(width / 2, height / 2 + 50, `Record: ${Math.max(this.finalScore, highScore)}`, {
      fontSize: '60px',
      fill: '#00cfff',
      fontStyle: 'bold',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

//     // Instrucción para reiniciar
//     this.add.text(width / 2, height / 2 + 200, "Presiona ENTER para reiniciar", {
//       fontSize: '60px',
//       fill: '#fff',
//       fontStyle: 'bold',
//       fontFamily: 'Arial Black'
//     }).setOrigin(0.5);

//     // Reiniciar el juego al presionar "ENTER"
//     this.input.keyboard.once("keydown-ENTER", () => {
//       this.scene.start("Game");
//     });
//   }

//   update() {
//     // This method is called every frame
//     // You can add game logic here, like checking for input or updating game objects
//   }
// }
  // Botón de Play (texto interactivo)
    const playButton = this.add.text(width / 2, height / 2 + 450, "▶ VOLVER A JUGAR", {
      fontSize: '80px',
      fill: '#00cfff',
      fontStyle: 'bold',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Cambia de escena al hacer clic
    playButton.on('pointerdown', () => {
      this.scene.start("Game");
    });

    // Opcional: efecto hover
    playButton.on('pointerover', () => playButton.setStyle({ fill: '#fff' }));
    playButton.on('pointerout', () => playButton.setStyle({ fill: '#00cfff' }));
  }
}