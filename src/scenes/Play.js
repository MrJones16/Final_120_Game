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
        this.player.touchClique = false;
        this.player.timerActive = false;
        //this.player.timerExpired = false;
        this.player.cliqueLockout = false;
        this.player.status = 0;
        this.statusConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: 'yellow',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.statusText = this.add.text(game.config.width - (borderUISize + borderPadding * 25), borderUISize + borderPadding * 2, "Unsafe", this.statusConfig);

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
        this.timerConfig = {
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
            this.player.touchClique = true;
        });

        // this.timeRemaining = this.time.delayedCall(5000, () => {
        //     //do something
        // }, null, this);
        // this.clockRight = this.add.text(game.config.width - (borderUISize + borderPadding * 10), borderUISize + borderPadding * 2, this.timeRemaining.getRemainingSeconds(), timerConfig);

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

        //Player status
        switch (this.player.status){
            //Player is unsafe (not hiding, but not spotted)
            case 0:
                this.statusText.setColor('yellow');
                this.statusText.text = "Unsafe";
                break;
            //Player is safe (hiding)
            case 1:
                this.statusText.setColor('green');
                this.statusText.text = "Safe";
                break;
            //Player is found (spotted)
            case 2:
                this.statusText.setColor('red');
                this.statusText.text = "Found!";
                break;
        }

        //Clique collision checking and timer
        //console.log("Touching clique: ", this.player.touchClique);
        console.log("Timer active: ", this.player.timerActive);

        if (this.player.touchClique && !this.player.cliqueLockout) {
            this.player.status = 1;
            if (!this.player.timerActive) {
                this.cliqueTimer = this.time.delayedCall(5000, () => {
                    this.player.status = 2;
                    this.player.timerActive = false;
                    this.player.cliqueLockout = true;
                    this.timerText.destroy();
                    this.lockoutText = this.add.text(game.config.width - (borderUISize + borderPadding * 35), borderUISize + borderPadding * 2, "[LOCK]", this.timerConfig);
                    this.lockoutTimer = this.time.delayedCall(10000, () => {
                        this.player.cliqueLockout = false;
                        this.lockoutText.destroy();
                    });
                    //this.add.text(game.config.width - (borderUISize + borderPadding * 20), borderUISize + borderPadding * 2, 'Found!', this.timerConfig);
                }, null, this);
                this.timerText = this.add.text(game.config.width - (borderUISize + borderPadding * 10), borderUISize + borderPadding * 2, this.cliqueTimer.getRemainingSeconds(), this.timerConfig);
            }   
            this.player.timerActive = true;
            //this.timerText = this.add.text(game.config.width - (borderUISize + borderPadding * 10), borderUISize + borderPadding * 2, this.cliqueTimer.getRemainingSeconds(), this.timerConfig);
        } else {
            if (this.player.status != 2) {
                this.player.status = 0;
            }
            if (this.player.timerActive) {
                this.player.timerActive = false;
                this.timerText.destroy();
                this.cliqueTimer.destroy();
            }
        }

        if (this.player.timerActive) {
            this.timerText.text = this.cliqueTimer.getRemainingSeconds();
        }

        // if (!this.player.touchClique && this.player.timerActive) {
        //     this.player.timerActive = false;
        //     this.timerText.destroy();
        //     this.cliqueTimer.destroy();
        // }

        this.player.touchClique = false;

    }

}
