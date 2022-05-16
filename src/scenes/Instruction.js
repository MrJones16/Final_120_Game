class Instruction extends Phaser.Scene{
    constructor(){
        super("instructionScene");
    }
    preload() {
        this.load.image('clique', './assets/placeholder_clique_green.png');
        this.load.image('player', './assets/sprite_boy_Y.png');
        this.load.image('store', './assets/placeholder_store_pink.png');
        this.load.image('guard', './assets/placeholder_guard.png');
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
     
        this.backButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 200, "Back", backConfig).setOrigin(0.5).setInteractive();
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
        
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 350, "Press WASD to move around; press SPACE when in stores to change clothes.", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 275, "Avoid the patrolling security guard's sight! (NOT FUNCTIONAL YET)", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 200, "Hide in cliques by standing in them; each clique has a 5 second timer.", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 125, "Hiding in a clique for too long will alert security and lock you out of hiding!", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 50, "You can only hide in cliques the same color as you.", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 25, "Change into different clothes (colors) at stores.", instructionConfig).setOrigin(0.5);
        this.add.image(game.config.width/2 - 450, game.config.height/2 + borderUISize + borderPadding + 125, 'clique');
        this.add.text(game.config.width/2 - 450, game.config.height/2 + borderUISize + borderPadding + 200, "Clique", instructionConfig).setOrigin(0.5);
        this.add.image(game.config.width/2 - 250, game.config.height/2 + borderUISize + borderPadding + 125, 'player').setScale(0.75);
        this.add.text(game.config.width/2 - 250, game.config.height/2 + borderUISize + borderPadding + 200, "Player", instructionConfig).setOrigin(0.5);
        this.add.image(game.config.width/2 + 250, game.config.height/2 + borderUISize + borderPadding + 125, 'guard');
        this.add.text(game.config.width/2 + 250, game.config.height/2 + borderUISize + borderPadding + 200, "Guard", instructionConfig).setOrigin(0.5);
        this.add.image(game.config.width/2 + 450, game.config.height/2 + borderUISize + borderPadding + 125, 'store');
        this.add.text(game.config.width/2 + 450, game.config.height/2 + borderUISize + borderPadding + 200, "Store", instructionConfig).setOrigin(0.5);
    }
}