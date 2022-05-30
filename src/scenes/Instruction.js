class Instruction extends Phaser.Scene{
    constructor(){
        super("instructionScene");
    }
    preload() {
        this.load.image('clique', './assets/sprite_NPC_G.png');
        this.load.image('player', './assets/sprite_boy_Y.png');
        this.load.image('store', './assets/sprite_rack_P.png');
        this.load.image('guard', './assets/sprite_Officer.png');
        this.load.image('arrow', './assets/arrow.png');
        this.load.image('floor_bg', './assets/biggerFloorTiles.png');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        this.load.atlas('guard_atlas', './assets/sprite_Officer_anim.png', './assets/sprite_Officer_anim.json');
        this.load.atlas('clique_g_atlas', './assets/sprite_NPC_G_anim1-sheet.png', './assets/sprite_NPC_G_anim1-sheet.json');
        this.load.atlas('goal_atlas', './assets/Door.png', './assets/Door.json');
        this.load.image('red_keycard', './assets/redKeyCard.png');
        this.load.image('goal', './assets/placeholder_goal.png');
        this.load.audio('bgm_instr', './assets/POL-find-the-exit-short.wav');
    }
    create(){
        this.background = this.add.tileSprite(0, 0, 1800, 1075, 'floor_bg').setOrigin(0, 0).setScale(0.8).setAlpha(0.25);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.arrow = this.add.sprite(game.config.width/2 - 150, game.config.height/2 + borderUISize + borderPadding + 200, 'arrow');
        this.bgmInstr = this.sound.add('bgm_instr', {volume: 0.2, loop: true, rate: 0.95});
        this.bgmInstr.play();

        this.anims.create({
            key: 'run_down_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_down_',
                start: 1,
                end: 3,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'clique_g_anim',
            frames: this.anims.generateFrameNames('clique_g_atlas', {
                prefix: 'clique_g_',
                start: 1,
                end: 2,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'guard_walk_left',
            frames: this.anims.generateFrameNames('guard_atlas', {
                prefix: 'guard_left_',
                start: 1,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'door_open',
            frames: this.anims.generateFrameNames('goal_atlas', {
                prefix: 'door',
                start: 1,
                end: 4,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // Back button
        let backConfig = {
          fontFamily: 'Century Gothic',
          fontSize: '48px',
          fontStyle: 'bold',
          color: 'dodgerblue',
          stroke: 'black',
          strokeThickness: 5,
          align: 'middle',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
        }
     
        this.backButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 200, "Main Menu", backConfig).setOrigin(0.5).setInteractive();
        this.backButton.on('pointerdown', () => { this.bgmInstr.stop(); this.scene.start('menuScene'); })

        let instructionConfig = {
            fontFamily: 'Century Gothic',
            fontSize: '48px',
            fontStyle: 'bold',
            color: 'goldenrod',
            stroke: 'black',
            strokeThickness: 5,
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 350, "How to Play", instructionConfig).setOrigin(0.5);
        instructionConfig.fontSize = '28px';
        instructionConfig.align = 'left';
        instructionConfig.fontStyle = 'normal';
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding - 300, "PREMISE", instructionConfig);
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding - 210, "CONTROLS", instructionConfig);
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding - 120, "GAMEPLAY", instructionConfig);
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding + 50, "GOAL", instructionConfig);
        instructionConfig.fontSize = '20px';
        instructionConfig.color = 'palegoldenrod';
        //this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 350, "Press WASD to move around; press SPACE when in stores to change clothes.", instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 260, "You're a mischievous kid who just stole their favorite game from the mall!", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 240, "Escape from the mall by blending into similarly dressed cliques of people!", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 170, "Press WASD to move around.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 150, "Press SPACEBAR to change into different sets of clothes while in a rack.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 80, "Avoid patrolling security guards by staying out of their detection radius.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 60, "If spotted, they will give chase until you hide yourself once again.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 40, "Cliques are your way to hide from guards. Walk into a clique of the same color to hide.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 20, "Beware of hiding in a clique for too long, or they will alert the guards and lock you out of hiding!", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding, "Also, avoid touching cliques of different colors than you at all times; they will alert the guards.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding + 20, "Remember, you can change clothes at clothing racks using SPACEBAR to fit into different cliques.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding + 90, "Touch the goal of each level to escape that level.", instructionConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding + 110, "Some levels require you to collect keycards to unlock the goal.", instructionConfig);
        instructionConfig.fontSize = '14px';
        this.add.text(game.config.width/2 - 575, game.config.height/2 + borderUISize + borderPadding + 240, "CHEAT: Press P to skip current level.", instructionConfig);
        instructionConfig.fontSize = '20px';
        instructionConfig.color = 'gold';

        this.clique = this.add.sprite(game.config.width/2 + 500, game.config.height/2 + borderUISize + borderPadding - 300, 'clique').setScale(0.5);
        this.clique.anims.play('clique_g_anim');
        this.add.text(game.config.width/2 + 500, game.config.height/2 + borderUISize + borderPadding - 250, "Clique", instructionConfig).setOrigin(0.5);

        this.player = this.add.sprite(game.config.width/2 + 350, game.config.height/2 + borderUISize + borderPadding - 300, 'player').setScale(0.75);
        this.player.anims.play('run_down_yellow');
        this.add.text(game.config.width/2 + 350, game.config.height/2 + borderUISize + borderPadding - 250, "Player", instructionConfig).setOrigin(0.5);

        this.guard = this.add.sprite(game.config.width/2 + 500, game.config.height/2 + borderUISize + borderPadding - 150, 'guard').setScale(0.5);
        this.guard.anims.play('guard_walk_left');
        this.add.text(game.config.width/2 + 500, game.config.height/2 + borderUISize + borderPadding - 100, "Guard", instructionConfig).setOrigin(0.5);

        this.add.image(game.config.width/2 + 350, game.config.height/2 + borderUISize + borderPadding - 150, 'store').setScale(0.5);
        this.add.text(game.config.width/2 + 350, game.config.height/2 + borderUISize + borderPadding - 100, "Rack", instructionConfig).setOrigin(0.5);

        this.goal = this.add.sprite(game.config.width/2 + 350, game.config.height/2 + borderUISize + borderPadding + 150, 'goal');
        this.goal.anims.play('door_open');
        this.add.text(game.config.width/2 + 350, game.config.height/2 + borderUISize + borderPadding + 200, "Goal", instructionConfig).setOrigin(0.5);

        this.keycard = this.add.sprite(game.config.width/2 + 500, game.config.height/2 + borderUISize + borderPadding + 150, 'red_keycard').setScale(0.65);
        this.add.text(game.config.width/2 + 500, game.config.height/2 + borderUISize + borderPadding + 200, "Keycard", instructionConfig).setOrigin(0.5);
        this.keycard.moveUp = false;
        this.keycard.origY = this.keycard.y;

        this.arrow.setDepth(2);
    }
    update(){
        if (this.keycard.y < this.keycard.origY - 10){
            this.keycard.moveUp = false;
        } else if (this.keycard.y > this.keycard.origY){
            this.keycard.moveUp = true;
        }

        if (this.keycard.moveUp){
            this.keycard.y -= 1;
        } else {
            this.keycard.y += 1;
        }

        if (this.keySPACE.isDown) {
            this.bgmInstr.stop();
            this.scene.start('menuScene');
        }
    }
}