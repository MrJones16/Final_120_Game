class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        this.load.image('player_yellow', './assets/placeholder_player_yellow.png');
        this.load.image('player_green', './assets/placeholder_player_green.png');
        this.load.image('player_pink', './assets/placeholder_player_pink.png');
        this.load.image('wall', './assets/placeholder_wall.png');
        this.load.image('clique_green', './assets/placeholder_clique_green.png');
        this.load.image('clique_yellow', './assets/placeholder_clique_yellow.png');
        this.load.image('clique_pink', './assets/placeholder_clique_pink.png');
        this.load.image('guard', './assets/placeholder_guard.png');
        this.load.image('store_green', './assets/placeholder_store_green.png');
        this.load.image('store_yellow', './assets/placeholder_store_yellow.png');
        this.load.image('store_pink', './assets/placeholder_store_pink.png');
        // this.load.image('rocket', './assets/missile.png');
        // this.load.audio('sfx_explosion', './assets/rocket_explosion.wav');
        // this.load.atlas('playeranims', './assets/Player_Sprite_Move.png', './assets/Player_Sprite_Move.json');
        // this.load.spritesheet('helicopter', './assets/helicopter-sheet.png', { frameWidth: 128, frameHeight: 64 });
    }
    

    create(){
        //Add player
        this.player = new Player(this, game.config.width / 2, game.config.height / 2, 'player_yellow').setOrigin(0.5, 0.5);
        this.player.type = 0;
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
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Wall group and creations
        this.wallGroup = this.physics.add.group();
        this.wallGroup.create(100, 100, 'wall').setOrigin(0, 0).setImmovable(true);
        this.wallGroup.create(300, 400, 'wall').setOrigin(0, 0).setImmovable(true);
        this.wallGroup.create(800, 300, 'wall').setOrigin(0, 0).setImmovable(true);

        //Clique group and creations
        this.cliqueGroup = this.physics.add.group();
        this.cliqueGroup.create(250, 250, 'clique_green').setOrigin(0, 0).setImmovable(true);
        this.cliqueGroup.create(700, 500, 'clique_yellow').setOrigin(0, 0).setImmovable(true);
        this.cliqueGroup.create(1000, 150, 'clique_pink').setOrigin(0, 0).setImmovable(true);

        this.cliqueGroup.getChildren().forEach((clique) => {
            if (clique.texture.key == 'clique_yellow'){
                clique.type = 0;
            } else if (clique.texture.key == 'clique_green'){
                clique.type = 1;
            } else if (clique.texture.key == 'clique_pink'){
                clique.type = 2;
            }
        });

        //Store group and creations
        this.storeGroup = this.physics.add.group();
        this.storeGroup.create(500, 150, 'store_yellow').setOrigin(0, 0).setImmovable(true);
        this.storeGroup.create(1000, 550, 'store_green').setOrigin(0, 0).setImmovable(true);
        this.storeGroup.create(100, 550, 'store_pink').setOrigin(0, 0).setImmovable(true);

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
        this.physics.add.overlap(this.player, this.cliqueGroup, (player, clique) => {
            if (clique.type == this.player.type){
                this.player.touchClique = true;
            } else {
                this.player.status = 2;
            }
        });
        this.physics.add.overlap(this.player, this.storeGroup, (player, store) => {
            if (keySPACE.isDown) {
                if (store.texture.key == 'store_yellow'){
                    this.player.setTexture('player_yellow');
                    this.player.type = 0;
                } else if (store.texture.key == 'store_green'){
                    this.player.setTexture('player_green');
                    this.player.type = 1;
                } else if (store.texture.key == 'store_pink'){
                    this.player.setTexture('player_pink');
                    this.player.type = 2;
                }
            }
        });

        //testing with paths and guards
        this.graphics = this.add.graphics();
        this.path = new Phaser.Curves.Path(10,10);
        this.path.lineTo(750,10);
        this.path.lineTo(750,300);

        this.guard = this.add.follower(this.path, 10,10, 'guard');
        this.guard.startFollow(
            {
                from:0,
                to:1,
                delay:2000,
                duration:10000,
                ease: 'Linear',
                hold:2000,
                repeat:-1,
                yoyo:true,
                rotateToPath:true
            }
        )
        

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
        //draw path lines
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.path.draw(this.graphics);
        //Player movement (preferred to move into player prefab; further debugging for that is required)
        if (keyA.isDown) {
            this.player.body.setVelocityX(-250);
        }
        if (keyD.isDown) {
            this.player.body.setVelocityX(250);
        } 
        if (keyW.isDown) {
            this.player.body.setVelocityY(-250);
        }
        if (keyS.isDown) {
            this.player.body.setVelocityY(250);
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

        //Clique collision and timer
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

        //If spotted, lockout of hiding for a few seconds
        //if (this.lockoutFlag) {

        //}

        if (this.player.timerActive) {
            this.timerText.text = this.cliqueTimer.getRemainingSeconds();
        }

        // if (!this.player.touchClique && this.player.timerActive) {
        //     this.player.timerActive = false;
        //     this.timerText.destroy();
        //     this.cliqueTimer.destroy();
        // }

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

        //console.log("Touching clique: ", this.player.touchClique);
        //console.log("Timer active: ", this.player.timerActive);
        //console.log("Player type: ", this.player.type);

        this.player.touchClique = false;

    }

}
