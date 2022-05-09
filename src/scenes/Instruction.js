class Instruction extends Phaser.Scene{
    constructor(){
        super("instructionScene");
    }
    create(){
        // Back button
        let backConfig = {
          fontFamily: 'Rockwell',
          fontSize: '48px',
          fontStyle: 'bold',
          color: 'dodgerblue',
          align: 'middle',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
        }
     
        this.backButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 150, "Back", backConfig).setOrigin(0.5).setInteractive();
        this.backButton.on('pointerdown', () => { this.scene.start('menuScene'); })

        let instructionConfig = {
            fontFamily: 'Rockwell',
            fontSize: '32px',
            color: 'goldenrod',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 250, "Press WASD to move around", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 150, "Hide in cliques, but not for too long", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 50, "Everything is hella scuffed rn lmao", instructionConfig).setOrigin(0.5);
    }
}