class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        this.load.image('player', './assets/placeholder_player.png');
        this.load.image('wall', './assets/placeholder_wall.png');
        this.load.image('clique', './assets/placeholder_clique.png');
        // this.load.image('rocket', './assets/missile.png');
        // this.load.audio('sfx_explosion', './assets/rocket_explosion.wav');
        // this.load.atlas('playeranims', './assets/Player_Sprite_Move.png', './assets/Player_Sprite_Move.json');
        // this.load.spritesheet('helicopter', './assets/helicopter-sheet.png', { frameWidth: 128, frameHeight: 64 });
    }

    create(){
        //Add player
        this.player = new Player(this, game.config.width / 2, game.config.height / 2, 'player').setOrigin(0.5, 0.5);

        //key definitions
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //Detection timer


        //Wall group and creations
        this.wallGroup = this.physics.add.group();
        this.wallGroup.create(100, 100, 'wall').setOrigin(0, 0).setImmovable(true);
        this.wallGroup.create(300, 400, 'wall').setOrigin(0, 0).setImmovable(true);
        this.wallGroup.create(800, 300, 'wall').setOrigin(0, 0).setImmovable(true);

        //Clique group and creations
        this.cliqueGroup = this.physics.add.group();
        this.cliqueGroup.create(250, 250, 'clique').setOrigin(0, 0).setImmovable(true);
        this.cliqueGroup.create(700, 500, 'clique').setOrigin(0, 0).setImmovable(true);
        this.cliqueGroup.create(1000, 150, 'clique').setOrigin(0, 0).setImmovable(true);

        //Timer text config
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: 'red',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        //Player collisions and overlaps
        this.physics.add.collider(this.player, this.wallGroup);
        this.physics.add.overlap(this.player, this.cliqueGroup, () => {
            this.timeRemaining = this.time.delayedCall(5000, () => {
                //do something
            }, null, this);
            this.clockRight = this.add.text(game.config.width - (borderUISize + borderPadding * 10), borderUISize + borderPadding * 2, this.timeRemaining.getRemainingSeconds(), timerConfig);
        });


        //Sound add
        //this.explosionSfx = this.sound.add('sfx_explosion', {volume: 0.25});

        //Creating background tileSprites
        //this.add.tileSprite(0, 0, 640, 480, 'sun').setOrigin(0, 0);

        //Physics Group
        //this.floorGroup = this.physics.add.group();


        //Physics Collisions
        //this.physics.add.collider(this.floorGroup, this.wallOfDeath, (floor, wall) => {floor.destroy();});

        // Create animations
        // this.anims.create({
        //     key: 'fly',
        //     frames: this.anims.generateFrameNumbers('helicopter', {frames: [0, 1, 2]}),
        //     frameRate: 30,
        //     repeat: -1
        // });

    }
    
    update() {
        //Player movement (preferred to move into player prefab; further debugging for that is required)
        if (keyA.isDown) {
            this.player.body.setVelocityX(-350);
        }
        if (keyD.isDown) {
            this.player.body.setVelocityX(350);
        } 
        if (keyW.isDown) {
            this.player.body.setVelocityY(-350);
        }
        if (keyS.isDown) {
            this.player.body.setVelocityY(350);
        }
        if (!keyD.isDown && !keyA.isDown){
            this.player.body.setVelocityX(0);
        }
        if (!keyW.isDown && !keyS.isDown){
            this.player.body.setVelocityY(0);
        }
        if (!keyD.isDown && !keyA.isDown && !keyW.isDown && !keyS.isDown) {
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);
        }

        //Wrap world (temporary)
        this.physics.world.wrap(this.player, 0);

    }

}
