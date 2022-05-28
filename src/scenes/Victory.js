class Victory extends Phaser.Scene{
    constructor(){
        super("victoryScene");
    }
    preload() {
        this.load.image('floor_bg', './assets/biggerFloorTiles.png');
        this.load.image('grass_bg', './assets/grass.png');
        this.load.image('player', './assets/sprite_boy_Y.png');
        this.load.image('guard', './assets/sprite_Officer.png');
        this.load.atlas('guard_atlas', './assets/sprite_Officer_anim.png', './assets/sprite_Officer_anim.json');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        this.load.image('goal', './assets/placeholder_goal.png');
        this.load.atlas('goal_atlas', './assets/door.png', './assets/door.json');
        this.load.image('arrow', './assets/arrow.png');
    }
    create(){
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.ARROWY = game.config.height/2 + borderUISize + borderPadding + 50;
        this.CREDITSX = game.config.width/2 - 400;
        this.MENUX = game.config.width/2 + 150;
        this.arrow = this.add.sprite(this.CREDITSX, this.ARROWY, 'arrow');
        this.arrow.setAlpha(0);
        this.canPress = false;

        this.moveFloor = false;
        this.moveGuard = false;
        this.moveGrass = false;
        this.grass = this.add.tileSprite(0, 0, 1200, 675, 'grass_bg').setOrigin(0, 0);
        this.floor = this.add.tileSprite(0, 0, 510, 850, 'floor_bg').setOrigin(0, 0).setScale(0.8);
        this.goal = this.add.sprite(25, 350, 'goal');
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
        this.goal.anims.play('door_open');
        this.goal.angle = 90;
        let victoryConfig = {
            fontFamily: 'Century Gothic',
            fontSize: '72px',
            fontStyle: 'bold',
            color: 'palegreen',
            stroke: 'black',
            strokeThickness: 5,
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.time.delayedCall(6000, () => {
            this.moveFloor = true;
        }, null, this);

        this.time.delayedCall(1500, () => {
            this.moveGuard = true;
        }, null, this);

        this.time.delayedCall(8500, () => {
            this.moveGrass = true;
        }, null, this);

        this.time.delayedCall(11000, () => {
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 100, "CONGRATULATIONS!", victoryConfig).setOrigin(0.5);
            victoryConfig.fontSize = '60px';
            this.add.text(game.config.width/2, game.config.height/2 - 75, "You escaped the mall!", victoryConfig).setOrigin(0.5);
            victoryConfig.fontSize = '48px';
            victoryConfig.color = "darkorchid";
            this.creditsButton = this.add.text(game.config.width/2 - 300, game.config.height/2 + borderUISize + borderPadding + 50, "Credits", victoryConfig).setOrigin(0.5).setInteractive();
            this.creditsButton.on('pointerdown', () => { this.scene.start('creditsScene'); })
            victoryConfig.color = "yellow";
            this.menuButton = this.add.text(game.config.width/2 + 300, game.config.height/2 + borderUISize + borderPadding + 50, "Main Menu", victoryConfig).setOrigin(0.5).setInteractive();
            this.menuButton.on('pointerdown', () => { this.scene.start('menuScene'); })
            this.arrow.setAlpha(1);
            this.canPress = true;
        }, null, this);
       
        //Show animation
        this.p = this.add.sprite(0, 350, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.anims.create({
            key: 'run_right_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_right_',
                start: 1,
                end: 2,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1
        });
        this.p.anims.play('run_right_yellow');

        this.g1 = this.add.sprite(-50, 350, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
        this.g2 = this.add.sprite(-50, 350, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
        this.g3 = this.add.sprite(-50, 350, 'guard').setOrigin(0.5, 0.5).setScale(0.5);
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
        this.g3.anims.play('guard_walk_right');

        this.arrow.setDepth(2);
        
    }
    update(){
        if (this.moveFloor){
            this.floor.x -= 3;
            this.goal.x -= 3;
            this.g1.x -= 3;
            this.g2.x -= 3;
            this.g3.x -= 3;
            if (this.floor.x < -450){
                this.moveFloor = false;
            }
        }
        if (this.moveGuard){
            this.g1.x += 3;
            this.g1.y -= 1;
            this.g2.x += 3;
            this.g3.x += 3;
            this.g3.y += 1;
            if ((this.g1.x > 350) && (this.g2.x > 350) && (this.g3.x > 350)) {
                this.moveGuard = false;
                this.g1.anims.stop();
                this.g2.anims.stop();
                this.g3.anims.stop();
            }
        }
        if (this.moveGrass){
            this.grass.tilePositionX += 3;
            if (this.p.x > 600){
                this.p.x -= 4;
            }
        } else {
            if (this.p.x < 1220){
                this.p.x += 4;
            }
        }

        if (this.canPress){
            if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
                if (this.arrow.x == this.MENUX) {
                    this.arrow.x = this.CREDITSX;
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.keyD)) {
                if (this.arrow.x == this.CREDITSX) {
                    this.arrow.x = this.MENUX;
                }
            }

            if (this.keySPACE.isDown) {
                if (this.arrow.x == this.CREDITSX) {
                    this.scene.start('creditsScene');
                } else if (this.arrow.x == this.MENUX) {
                    this.scene.start('menuScene');
                }
            }
        }
    }
}