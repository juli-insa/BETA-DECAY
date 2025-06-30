import pantallaprincipal from "./scenes/pantallaprincipal.js";

import incio from "./scenes/incio.js";

import Game from "./scenes/Game.js";

import findeljuego from "./scenes/findeljuego.js";





// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false, // Set to true if you want to see physics debug information
    },
  },

  render: {
    pixelArt: true, // Enable pixel art rendering
    antialias: false, // Disable antialiasing for pixel art
    roundPixels: true, // Ensure pixels are rendered as squares
  },
  
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [pantallaprincipal, incio, Game, findeljuego],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
