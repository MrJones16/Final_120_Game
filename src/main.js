// NAMES: Dominic Berardi, Peyton Jones, Luis Acevedo
// GAME TITLE: 
// DATE: 
// 
// CREATIVE TILT JUSTIFICATION
//
// Programming:
//
// Style:
//

let config = {
    type: Phaser.CANVAS,
    width: 1200,
    height: 675,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 1000},
        debug: false
      }
    },
    scene: [Menu, Play]
  }

let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyLEFT, keyRIGHT;


// Background music variable
var musicStarted = false;
