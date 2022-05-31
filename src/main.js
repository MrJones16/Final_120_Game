// NAMES: Dominic Berardi, Peyton Jones, Luis Acevedo
// GAME TITLE: Hide-N-Out
// DATE: 5/31/2022
// 
// CREATIVE TILT JUSTIFICATION
//
// Programming: 
// 
// One way our programming was creative is that instead of creating a multitude of different Phaser scenes for levels, 
// we contained all of the code for a playable level in a single file, Play.js. Every time this file is loaded, it begins a different level.
// 
// Our setup for creating levels also was made much easier by our use of functions that handled many of the busy work.
// We used Tiled to create levels, and then a function called loadLevel() iterated through each of the objects in the level,
// and called the appropriate creation functions for each object (player, guard, clique, etc.).
// 
// The guard pathing and AI is something we are proud of as well. Though they begin chase by a simple detection radius, their movement along 
// their path is not using Phaser path objects, as we found that too restrictive; they follow invisible path points that we have created as tiles.
// Guards also are smart about when they stop chasing the player and know their last position on their path.
//
// Physics groups are utilized a lot. This allowed us to easily create many of the same object (or family of objects, such as different colored
// cliques) and iterate through the objects in each group to handle to update() code for each one.
//
// Style:
// 
// Our game has a distinct pixel art visual style. Every asset (except for the music, which even then was edited to be pitched down or up) was 
// created from the ground up by us. Though our game may not be the most visually striking, we are still very proud that a group of non-artists 
// such as ourselves were able to make something like this in the first place.
//
// Something that was done as extra work, and not in the original plans were the creation of small cutscene like animations. These are seen on
// the title screen (player running around from guard), the load screen (increasing amounts of guards chasing player), game over screen (surrounded
// by a group fo guards), and lastly the largest one plays during the victory screen (player runs out of mall, guards stop chase, and the player happily
// runs off). Each of these took a lot of technical work inside of the code, but they turned out great.
//
// We believe our game confines to the project theme of fitting very well. In our game, you must "fit in" with other people to make to it the goal.
// Our aesthetic of a more lighthearted silly game, combined with the tension of a stealth game, make the game experience something quite unique.
// Difficulty-wise, levels don't get too hard, and though they can get long, anybody with enough patience and skill can make it through (though, they
// can press P to skip levels, too).

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
