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
    fps: {
      target: 60,
      forceSetTimeOut: true
    },
    physics: {
      default: 'arcade',
      arcade: {
        //debug: true
      }
    },
    scene: [Menu, Play, Instruction, LevelLoad, GameOver, Victory, Credits]
  }
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyW, keyA, keyS, keyD, keySPACE, keyP;

// Global level tracker
var currentLevel = 0;

// Background music variable
var musicStarted = false;
