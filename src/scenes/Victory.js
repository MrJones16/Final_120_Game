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
    }
    create(){
        this.moveFloor = false;
        this.moveGuard = false;
        this.moveGrass = false;
        this.grass = this.add.tileSprite(0, 0, 1200, 675, 'grass_bg').setOrigin(0, 0);
        this.floor = this.add.tileSprite(0, 0, 510, 850, 'floor_bg').setOrigin(0, 0).setScale(0.8);
        this.goal = this.add.sprite(25, 350, 'goal');
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

        this.time.delayedCall(10000, () => {
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
    }
}