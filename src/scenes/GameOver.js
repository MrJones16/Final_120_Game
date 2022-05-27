class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOverScene");
    }
    preload() {
        this.load.image('floor_bg', './assets/biggerFloorTiles.png');
        this.load.image('player', './assets/sprite_boy_Y.png');
        this.load.image('guard', './assets/sprite_Officer.png');
        this.load.atlas('guard_atlas', './assets/sprite_Officer_anim.png', './assets/sprite_Officer_anim.json');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        this.load.audio('sfx_gameover', './assets/game_over.wav');
    }
    create(){
        this.background = this.add.tileSprite(0, 0, 1800, 1075, 'floor_bg').setOrigin(0, 0).setScale(0.8);
        this.sfxGameOver = this.sound.add('sfx_gameover');
        let overConfig = {
            fontFamily: 'Century Gothic',
            fontSize: '72px',
            fontStyle: 'bold',
            color: 'lightcoral',
            stroke: 'black',
            strokeThickness: 5,
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show game over text
        this.time.delayedCall(1650, () => {
            this.sfxGameOver.play();
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 100, "GAME OVER", overConfig).setOrigin(0.5);
            overConfig.fontSize = '60px';
            this.add.text(game.config.width/2, game.config.height/2 - 75, "You were caught!", overConfig).setOrigin(0.5);
            overConfig.fontSize = '48px';
            overConfig.color = "lime";
            this.restartButton = this.add.text(game.config.width/2 - 300, game.config.height/2 + borderUISize + borderPadding + 50, "Continue", overConfig).setOrigin(0.5).setInteractive();
            this.restartButton.on('pointerdown', () => { this.scene.start('playScene'); })
            overConfig.fontSize = '20px';
            this.add.text(game.config.width/2 - 300, game.config.height/2 + borderUISize + borderPadding + 85, "(From Current Level)", overConfig).setOrigin(0.5);
            overConfig.fontSize = '48px';
            overConfig.color = "red";
            this.menuButton = this.add.text(game.config.width/2 + 300, game.config.height/2 + borderUISize + borderPadding + 50, "Main Menu", overConfig).setOrigin(0.5).setInteractive();
            this.menuButton.on('pointerdown', () => { this.scene.start('menuScene'); })
            overConfig.fontSize = '20px';
            this.add.text(game.config.width/2 + 300, game.config.height/2 + borderUISize + borderPadding + 85, "(Reset to Level 1)", overConfig).setOrigin(0.5);
        }, null, this);

        //Show animation
        this.p = this.add.sprite(600, 450, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.anims.create({
            key: 'idle_down_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_down_',
                start: 1,
                end: 1,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1,
        });
        this.p.anims.play('idle_down_yellow');

        this.g1 = this.add.sprite(450, 300, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
        this.g2 = this.add.sprite(450, 600, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
        this.g3 = this.add.sprite(750, 600, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
        this.g4 = this.add.sprite(750, 300, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
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
            key: 'guard_walk_right',
            frames: this.anims.generateFrameNames('guard_atlas', {
                prefix: 'guard_right_',
                start: 1,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.g1.anims.play('guard_walk_right');
        this.g2.anims.play('guard_walk_right');
        this.g3.anims.play('guard_walk_left');
        this.g4.anims.play('guard_walk_left');
        
    }
    update(){
        if ((this.g1.x < 550) && (this.g2.x < 550) && (this.g3.x > 650) && (this.g4.x > 650)){
            this.g1.x += 1;
            this.g1.y += 1;
            this.g2.x += 1;
            this.g2.y -= 1;
            this.g3.x -= 1;
            this.g3.y -= 1;
            this.g4.x -= 1;
            this.g4.y += 1;
        } else {
            this.g1.anims.stop();
            this.g2.anims.stop();
            this.g3.anims.stop();
            this.g4.anims.stop();
        }
    }
}