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
    this.load.image("Cielo", "./public/assets/Cielo2.png");
     this.load.spritesheet("play", "./public/assets/play.png", {
      frameWidth: 360,
      frameHeight: 360
     });
     this.load.audio("burbuja", "./public/assets/burbujavidaexplota.mp3");
     this.load.audio("sonidopuntos", "./public/assets/puntosfinales.mp3");
    }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
   this.sonidopunto = this.sound.add("sonidopuntos");
   this.sonidopunto.play(); // ← Reproduce el sonido al iniciar la escena

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

 
 this.anims.create({
  key: 'playAnim',
  frames: this.anims.generateFrameNumbers('play', { start: 4, end: 1 }),
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
}


  update() {
    if (this.sonidoburbuja) this.sonidoburbuja.play(); 
    // update logic
    // this is called every frame
  }

  // other methods
  // for example, to create animations, groups, etc.
}