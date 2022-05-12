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
        //gravity: {y: 1000},
        debug: true
      }
    },
    scene: [Menu, Play, Instruction]
  }

let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyW, keyA, keyS, keyD, keySPACE;


// Background music variable
var musicStarted = false;
