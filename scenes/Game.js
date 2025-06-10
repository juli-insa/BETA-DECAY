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
      triangle: 0,
      cuadrado: 0,
      diamond: 0,
      cuchillo: 0,
    };
    this.score = 0; // Inicializar el puntaje
    this.timeLeft = 30; // Inicializar el tiempo
  }

  preload() {
    // load assets
    this.load.image("Cielo", "./public/assets/Cielo.webp");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("FondoMenu", "./public/assets/FondoMenu.jpg");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("beta", "./public/assets/beta.webp", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("cuchillo", "./public/assets/shuriken.png");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo
    this.add.image(width / 2, height / 2, "Cielo")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Plataforma principal (estática)
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(1000, 0, "platform").setScale(5).refreshBody();

    // Plataformas móviles
    this.movingPlatforms = this.physics.add.group();
    let p1 = this.movingPlatforms.create(50, 350, "platform");
    let p2 = this.movingPlatforms.create(750, 220, "platform");
    [p1, p2].forEach(platform => {
      platform.body.allowGravity = false;
      platform.body.immovable = true;
    });

    // Jugador
    this.player = this.physics.add.sprite(400, 300, "beta").setScale(0.1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Colisiones
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.movingPlatforms, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Configurar el puntaje
    this.scoreText = this.add.text(16, 16, `Puntos: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });


    // Temporizador para generar formas aleatorias
    this.randomShapeTimer = this.time.addEvent({
      delay: 1000, // 1 segundo
      callback: this.createRandomShape,
      callbackScope: this,
      loop: true,
    });

    this.cuchilloTimer = this.time.addEvent({
      delay: 850, //  milisegundos
      callback: this.createcuchillo,
      callbackScope: this,
      loop: true,
    });

    // Temporizador para crear plataformas móviles aleatorias
    this.time.addEvent({
      delay: 1000, // cada 2 segundos (ajusta el tiempo si quieres)
      callback: () => {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = this.scale.height; // Aparecen abajo de la pantalla
        const platform = this.movingPlatforms.create(x, y, "platform");
        platform.setVelocityY(-50); // Opcional: velocidad inicial hacia arriba
        platform.body.allowGravity = false;
        platform.body.immovable = true;
      },
      callbackScope: this,
      loop: true,
    });
  }

  // Crear una forma aleatoria
  createRandomShape() {
    const randomIndex = Phaser.Math.Between(0, 2); // Generar un índice aleatorio entre 0 y 2

    if (randomIndex === 0) {
      this.createDiamond(); // Crear un diamante
    } else if (randomIndex === 1) {
      this.createSquare(); // Crear un cuadrado
    } else {
      this.createTriangle(); // Crear un triángulo
    }
  }

  // Crear diamantes
  createDiamond() {
    const diamondGroup = this.physics.add.group({
      key: "diamond",
      setScale: { x: 0.5, y: 0.5 },
      repeat: 0,
      setXY: { x: Phaser.Math.Between(50, 750), y: 0 },
    });

    diamondGroup.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setBounceX(1);
      child.setVelocityX(Phaser.Math.Between(-100, 100));
      child.setData("points", 15);
      child.setTint(0xff0000);
      child.setCollideWorldBounds(true); // Evitar que salga de la pantalla
    });

    this.physics.add.collider(diamondGroup, this.platforms, this.handlePlatformCollision, null, this);
    this.physics.add.overlap(this.player, diamondGroup, this.collectDiamond, null, this);
  }


  // Crear cuchillos
  createcuchillo() {
    const cuchilloGroup = this.physics.add.group({
      key: "cuchillo",
      setScale: { x: 0.1, y: 0.1 },
      repeat: 0,
      setXY: { x: Phaser.Math.Between(50, 750), y: 0 },
    });

    cuchilloGroup.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setBounceX(1);
      child.setVelocityX(Phaser.Math.Between(-100, 100));
      child.setData("points", -15);
      child.setCollideWorldBounds(true); // Evitar que salga de la pantalla
    });

    this.physics.add.collider(cuchilloGroup, this.platforms, this.handlePlatformCollision, null, this);
    this.physics.add.overlap(this.player, cuchilloGroup, this.collectcuchillo, null, this);

    this.tweens.add({
      targets: cuchilloGroup.getChildren(),
      angle: 360,
      duration: 1000,
      repeat: -1,
    });
  }

  // Crear cuadrados
  createSquare() {
    const squareGroup = this.physics.add.group({
      key: "square",
      setScale: { x: 0.5, y: 0.5 },
      repeat: 0,
      setXY: { x: Phaser.Math.Between(50, 750), y: 0 },
    });

    squareGroup.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setBounceX(1);
      child.setVelocityX(Phaser.Math.Between(-100, 100));
      child.setData("points", 10);
      child.setTint(0x00ff00);
      child.setCollideWorldBounds(true);
    });

    this.physics.add.collider(squareGroup, this.platforms, this.handlePlatformCollision, null, this);
    this.physics.add.overlap(this.player, squareGroup, (player, square) => {
      square.disableBody(true, true);
      this.score += 10;
      this.scoreText.setText(`Puntos: ${this.score}`);
      this.figurasContador.cuadrado++;
      console.log(this.figurasContador);
    }, null, this);
  }

  // Crear triángulos
  createTriangle() {
    const triangleGroup = this.physics.add.group({
      key: "triangle",
      setScale: { x: 0.5, y: 0.5 },
      repeat: 0,
      setXY: { x: Phaser.Math.Between(50, 750), y: 0 },
    });

    triangleGroup.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setBounceX(1);
      child.setVelocityX(Phaser.Math.Between(-100, 100));
      child.setData("points", 12);
      child.setTint(0x0000ff);
      child.setCollideWorldBounds(true);
    });

    this.physics.add.collider(triangleGroup, this.platforms, this.handlePlatformCollision, null, this);
    this.physics.add.overlap(this.player, triangleGroup, (player, triangle) => {
      triangle.disableBody(true, true);
      this.score += 12;
      this.scoreText.setText(`Puntos: ${this.score}`);
      this.figurasContador.triangle++;
      console.log(this.figurasContador);
    }, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300); // Mover a la izquierda
      //que el personaje ruede sobre si mismo a la izquierda
      this.player.angle -= 5; // Rueda hacia la izquierda
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300); // Mover a la derecha
      this.player.angle += 5;
    } else {
      this.player.setVelocityX(0); // Detener movimiento horizontal
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330); // Saltar
    }
    // Mover solo las plataformas móviles hacia arriba
    this.movingPlatforms.children.iterate((platform) => {
      platform.y -= 1; // Ajusta la velocidad aquí
      platform.body.updateFromGameObject(); // Actualiza el cuerpo físico
    });
  }

  updateTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timerText.setText(`Tiempo: ${this.timeLeft}`);
    } else {
      this.checkWinOrLose(); // Verificar si gana o pierde cuando el tiempo se agote
    }
  }




  collectDiamond(player, diamond) {
    diamond.disableBody(true, true); // Desactiva el diamante
    this.score += 15; // Incrementa el puntaje
    this.scoreText.setText(`Puntos: ${this.score}`); // Actualiza el texto del puntaje

    // Incrementar el contador de diamantes
    this.figurasContador.diamond++;
    console.log(this.figurasContador); // Mostrar el contador en la consola
  }



  collectcuchillo(player, cuchillo) {
    cuchillo.disableBody(true, true); // Desactiva el cuchillo
    this.score += -15; // Reduce el puntaje
    this.scoreText.setText(`Puntos: ${this.score}`);

    // Incrementar el contador de cuchillos
    this.figurasContador.cuchillo++;
    console.log(this.figurasContador); // Mostrar el contador en la consola
  }

  handlePlatformCollision(shape, platform) {
    // Reducir puntos del objeto
    const currentPoints = shape.getData("points") - 5;
    shape.setData("points", currentPoints);

    // Verificar si los puntos llegan a 0
    if (currentPoints <= 0) {
      shape.disableBody(true, true); // Desactivar el objeto
    }
  }
}