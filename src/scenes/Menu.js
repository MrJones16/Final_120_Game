class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        this.load.tilemapTiledJSON("menu", "./assets/tilemap_menu.json");
        this.load.image('MallTileSet', "./assets/MallTileSet.png");
        this.load.image('player_yellow', './assets/sprite_boy_Y.png');
        this.load.image('guard', './assets/sprite_Officer.png');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        this.load.atlas('guard_atlas', './assets/sprite_Officer_anim.png', './assets/sprite_Officer_anim.json');
        this.load.audio('bgm_menu', './assets/POL-pet-park-short.wav');
        this.load.image('arrow', './assets/arrow.png');
        // load audio
        // this.load.audio('sfx_select', './assets/blip_select12.wav');
        // this.load.image('background', './assets/runner_bg.png');
        // this.load.audio('bgm', './assets/POL-rocket-station-short.wav');
    }

    create(){
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.ARROWX = game.config.width/2 - 150;
        this.STARTY = game.config.height/2 + borderUISize + borderPadding - 50;
        this.INSTRY = game.config.height/2 + borderUISize + borderPadding + 25;
        this.CREDY = game.config.height/2 + borderUISize + borderPadding + 100;

        this.arrow = this.add.sprite(this.ARROWX, this.STARTY, 'arrow');

        this.bgmMenu = this.sound.add('bgm_menu', {volume: 0.35, loop: true, rate: 0.90});
        this.bgmMenu.play();
        const map_menu = this.add.tilemap("menu");
        const tileset_menu = map_menu.addTilesetImage("MallTileSet", null, 64, 64, 1, 2);
        const backgroundLayer = map_menu.createLayer("Background", tileset_menu, 0, 0);
        currentLevel = 0;

        let smallConfig = {
            fontFamily: 'Century Gothic',
            fontSize: '20px',
            color: 'black',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding + 375, "Menu controls: WASD to navigate / SPACE to select", smallConfig).setOrigin(0.5);

        let menuConfig = {
            fontFamily: 'Century Gothic',
            fontSize: '90px',
            fontStyle: 'bold',
            color: 'lightsteelblue',
            stroke: 'black',
            strokeThickness: 5,
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 85, "HIDE-N-OUT", menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '48px';
        menuConfig.color = "lime";
        this.startButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 50, "Start", menuConfig).setOrigin(0.5).setInteractive();
        this.startButton.on('pointerdown', () => { this.bgmMenu.stop(); this.scene.start('levelLoadScene'); })
        menuConfig.color = "yellow";
        this.instrButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 25, "Instructions", menuConfig).setOrigin(0.5).setInteractive();
        this.instrButton.on('pointerdown', () => { this.bgmMenu.stop(); this.scene.start('instructionScene'); })
        menuConfig.color = "darkorchid";
        this.creditsButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 100, "Credits", menuConfig).setOrigin(0.5).setInteractive();
        this.creditsButton.on('pointerdown', () => { this.bgmMenu.stop(); this.scene.start('creditsScene'); })
        // menuConfig.color = "red";
        // this.exitButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 150, "Exit", menuConfig).setOrigin(0.5).setInteractive();
        // this.exitButton.on('pointerdown', () => { game.destroy(); })
        // menuConfig.color = "darkorchid";
        // menuConfig.fontSize = '20px';
        // this.creditsButton = this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding + 175, "Credits", menuConfig).setOrigin(0.5).setInteractive();
        // this.creditsButton.on('pointerdown', () => { this.scene.start('creditsScene'); })
        // this.add.text(game.config.width/2 + 200, game.config.height/2 + borderUISize + borderPadding + 175, "Version 1.0");

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

        this.playerY = this.physics.add.sprite(1300, 600, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.anims.create({
            key: 'run_left_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_left_',
                start: 1,
                end: 2,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1
        });
        this.playerY.anims.play('run_left_yellow');
        this.playerY.moving = false;
        this.guardY = this.physics.add.sprite(1700, 600, 'guard').setScale(0.5);
        this.guardY.anims.play('guard_walk_left');

        this.playerG = this.physics.add.sprite(100, 775, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.anims.create({
            key: 'run_up_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_up_',
                start: 1,
                end: 3,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1
        });
        this.playerG.anims.play('run_up_green');
        this.playerG.moving = false;
        this.guardG = this.physics.add.sprite(100, 1075, 'guard').setScale(0.5);
        this.guardG.anims.play('guard_walk_right');

        this.playerP = this.physics.add.sprite(1100, -100, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.anims.create({
            key: 'run_down_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_down_',
                start: 1,
                end: 3,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1
        });
        this.playerP.anims.play('run_down_pink');
        this.playerP.moving = false;
        this.guardP = this.physics.add.sprite(1100, -400, 'guard').setScale(0.5);
        this.guardP.anims.play('guard_walk_left');

        this.currPlayerMove = 0;
        this.arrow.setDepth(2);
    }
    update(){
        switch (this.currPlayerMove){
            case (0):
                if (!this.playerY.moving){
                    this.playerY.moving = true;
                    this.playerY.setVelocityX(-250);
                    this.guardY.setVelocityX(-300);
                }
                if (this.playerY.x < -700){
                    this.playerY.x = 1300;
                    this.playerY.moving = false;
                    this.playerY.setVelocityX(0);
                    this.guardY.setVelocityX(0);
                    this.guardY.x = 1700;
                    this.currPlayerMove = 1;
                }
                break;
            case (1):
                if (!this.playerG.moving){
                    this.playerG.moving = true;
                    this.playerG.setVelocityY(-250);
                    this.guardG.setVelocityY(-300);
                }
                if (this.playerG.y < -700){
                    this.playerG.y = 775;
                    this.playerG.moving = false;
                    this.playerG.setVelocityY(0);
                    this.guardG.setVelocityY(0);
                    this.guardG.y = 1075;
                    this.currPlayerMove = 2;
                }
                break;
            case (2):
                if (!this.playerP.moving){
                    this.playerP.moving = true;
                    this.playerP.setVelocityY(250);
                    this.guardP.setVelocityY(300);
                }
                if (this.playerP.y > 1375){
                    this.playerP.y = -100;
                    this.playerP.moving = false;
                    this.playerP.setVelocityY(0);
                    this.guardP.setVelocityY(0);
                    this.guardP.y = -400;
                    this.currPlayerMove = 0;
                }
                break;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            if (this.arrow.y == this.STARTY) {
                this.arrow.y = this.INSTRY;
            } else if (this.arrow.y == this.INSTRY) {
                this.arrow.y = this.CREDY;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
            if (this.arrow.y == this.CREDY) {
                this.arrow.y = this.INSTRY;
            } else if (this.arrow.y == this.INSTRY) {
                this.arrow.y = this.STARTY;
            }
        }

        if (this.keySPACE.isDown) {
            this.bgmMenu.stop();
            if (this.arrow.y == this.STARTY) {
                this.scene.start('levelLoadScene');
            } else if (this.arrow.y == this.INSTRY) {
                this.scene.start('instructionScene');
            } else if (this.arrow.y == this.CREDY) {
                this.scene.start('creditsScene');
            }
        }
    }
}