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
        this.load.audio('sfx_alert', './assets/alert.wav');
        this.load.audio('sfx_clothes', './assets/change_clothes.wav');
        this.load.audio('bgm_alert', './assets/POL-elevators-short.wav');
        this.load.audio('bgm_normal', './assets/POL-jazzy-duck-short.wav');
        
        // this.load.image('rocket', './assets/missile.png');
        // this.load.audio('sfx_explosion', './assets/rocket_explosion.wav');
        // this.load.atlas('playeranims', './assets/Player_Sprite_Move.png', './assets/Player_Sprite_Move.json');
        // this.load.spritesheet('helicopter', './assets/helicopter-sheet.png', { frameWidth: 128, frameHeight: 64 });
        this.changeClothesSound = false;
    }
    
    

    create(){
        
        //Add player
        this.player = new Player(this, game.config.width / 2, game.config.height / 2, 'player_yellow').setOrigin(0.5, 0.5);
        this.player.type = 0;
        this.player.touchClique = false;
        //this.player.timerActive = false;
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
        this.lockoutShow = false;

        //SFX
        this.sfxAlert = this.sound.add('sfx_alert', {volume: 0.5});
        this.sfxClothes = this.sound.add('sfx_clothes', {volume: 0.65});

        //BGM
        this.bgmNormal = this.sound.add('bgm_normal', {volume: 0.2, loop: true, rate: 0.95});
        this.bgmAlert = this.sound.add('bgm_alert', {volume: 0.2, loop: true, rate: 1.05});
        this.bgmPlaying = 0;
        this.bgmNormal.play();

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
            clique.timer = 330;
            clique.active = false;
            clique.touching = false;
            clique.timeText = this.add.text(clique.x - 55, clique.y - 35, Math.trunc(clique.timer / 60), this.timerConfig);
            clique.timeText.setAlpha(0);
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

        //Player collisions and overlaps
        this.physics.add.collider(this.player, this.wallGroup);
        this.physics.add.overlap(this.player, this.cliqueGroup, (player, clique) => {
            if (clique.type == this.player.type && !this.player.cliqueLockout){
                this.player.touchClique = true;
                clique.touching = true;
                clique.active = true;
            } else {
                this.player.status = 2;
            }
        });
        
        this.physics.add.overlap(this.player, this.storeGroup, (player, store) => {
            if (keySPACE.isDown) {
                if (store.texture.key == 'store_yellow'){
                    this.player.setTexture('player_yellow');
                    this.player.type = 0;
                    if (!this.changeClothesSound){
                        this.sfxClothes.play();
                        this.changeClothesSound = true;
                        this.time.delayedCall(1000, () => {
                            this.changeClothesSound = false;
                        }, null, this);
                    }
                } else if (store.texture.key == 'store_green'){
                    this.player.setTexture('player_green');
                    this.player.type = 1;
                    if (!this.changeClothesSound){
                        this.sfxClothes.play();
                        this.changeClothesSound = true;
                        this.time.delayedCall(1000, () => {
                            this.changeClothesSound = false;
                        }, null, this);
                    }
                } else if (store.texture.key == 'store_pink'){
                    this.player.setTexture('player_pink');
                    this.player.type = 2;
                    if (!this.changeClothesSound){
                        this.sfxClothes.play();
                        this.changeClothesSound = true;
                        this.time.delayedCall(1000, () => {
                            this.changeClothesSound = false;
                        }, null, this);
                    }
                }
            }
        });

        //game over text
        //this.gameover = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 100, "", this.timerConfig).setOrigin(0.5);
        //guard group and collisions
        this.guardGroup = this.physics.add.group();
        this.physics.add.collider(this.guardGroup, this.wallGroup);
        this.physics.add.collider(this.guardGroup, this.player, (guard, player) => {
            //Guard collides with player

            //handle actual game over stuff here
            //this.gameover.text = "Game Over";
            console.log("you've been caught!");
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 100, "GAME", this.timerConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 80, "OVER", this.timerConfig).setOrigin(0.5);
           
        });

        //testing with paths and guards
        this.graphics = this.add.graphics();
        this.path = new Phaser.Curves.Path(10,10);
        this.path.lineTo(750,10);
        this.path.lineTo(750,300);

        this.guard = this.add.follower(this.path, 10,10, 'guard');
        this.guard.storeX = 0;
        this.guard.storeY = 0;
        this.guard.state = 0;
        //adding collision to the guard
        this.physics.world.enable(this.guard);
        this.guardGroup.add(this.guard);
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



        //Guard Vision Range:
        this.visionRange = 200;
    }
    
    update(time, delta) {
        this.physics.world.setFPS(60);

        //BGM updating
        if (this.player.status == 2 && this.bgmPlaying == 0) {
            this.bgmNormal.stop();
            this.bgmAlert.play();
            this.bgmPlaying = 1;
        } else if (this.player.status != 2 && this.bgmPlaying == 1) {
            this.bgmAlert.stop();
            this.bgmNormal.play();
            this.bgmPlaying = 0;
        }
        
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

        // Clique touching player flag reset
        if (!this.player.touchClique) {
            this.cliqueGroup.getChildren().forEach((clique) => {
                clique.touching = false;
            });
        }

        // Individual clique timer code
        this.cliqueGroup.getChildren().forEach((clique) => {
            if ((!clique.touching || this.player.status == 2) && clique.timer < 330) {
                clique.timer += 0.5;
            } else if (clique.touching && clique.timer > 30) {
                clique.timer -= 1;
            } else if (clique.timer == 30) {
                this.player.status = 2;
                this.player.cliqueLockout = true;
            }
        });

        //Individual clique timer text
        this.cliqueGroup.getChildren().forEach((clique) => {
            if (clique.timer == 330){
                clique.timeText.setAlpha(0);
                clique.active = false;
            }
            if (clique.active) {
                clique.timeText.setAlpha(100);
                clique.timeText.text = Math.trunc(clique.timer / 60);
            }
        });

        //Clique lockout
        if (this.player.cliqueLockout && !this.lockoutShow) {
            this.lockoutShow = true;
            this.lockoutText = this.add.text(game.config.width - (borderUISize + borderPadding * 35), borderUISize + borderPadding * 2, "[LOCK]", this.timerConfig);
            this.lockoutTimer = this.time.delayedCall(10000, () => {
                this.player.cliqueLockout = false;
                this.lockoutText.destroy();
                this.lockoutShow = false;
            }, null, this); 
        }

        //Clique collision and timer (some old code commented out)
        if (this.player.touchClique && !this.player.cliqueLockout) {
            this.player.status = 1;
            // if (!this.player.timerActive) {
            //     this.cliqueTimer = this.time.delayedCall(5000, () => {
            //         this.player.status = 2;
            //         this.player.timerActive = false;
            //         this.player.cliqueLockout = true;
            //         this.timerText.destroy();
            //         this.lockoutText = this.add.text(game.config.width - (borderUISize + borderPadding * 35), borderUISize + borderPadding * 2, "[LOCK]", this.timerConfig);
            //         this.lockoutTimer = this.time.delayedCall(10000, () => {
            //             this.player.cliqueLockout = false;
            //             this.lockoutText.destroy();
            //         });
            //     }, null, this);
            //     this.timerText = this.add.text(game.config.width - (borderUISize + borderPadding * 10), borderUISize + borderPadding * 2, this.cliqueTimer.getRemainingSeconds(), this.timerConfig);
            // }   
            // this.player.timerActive = true;
        } else {
            if (this.player.status != 2) {
                this.player.status = 0;
            }
            // if (this.player.timerActive) {
            //     this.player.timerActive = false;
            //     this.timerText.destroy();
            //     this.cliqueTimer.destroy();
            // }
        }

        // Show timer (old)
        // if (this.player.timerActive) {
        //     this.timerText.text = this.cliqueTimer.getRemainingSeconds();
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

        
        //updating the guards
        this.guardGroup.getChildren().forEach((guard) => {
            switch(guard.state){
                case(0)://patrolling 
                    if (Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y) < this.visionRange){
                        this.playerSpotted(guard, this.player);
                        console.log("Player is in range to begin hunting");
                    } else if (this.player.status == 2){
                        this.playerSpotted(guard, this.player);
                        console.log("Player is in range to begin hunting");
                    }
                    break;
                case(1)://hunting player
                    this.physics.moveTo(guard, this.player.x, this.player.y, 300);
                    console.log("moving to player");
                    if (this.player.status == 1){
                        this.returnToPath(guard, this.player);
                        console.log("player is safe, go back to path");
                    }
                    break;
                case (3)://going back to path
                    this.physics.moveTo(guard, guard.storeX, guard.storeY, 300);
                    break;
                default:
                    break;
            }
        });
    }

    playerSpotted(guard, player){
        console.log("Player Spotted");
        guard.storeX = guard.x;
        guard.storeY = guard.y;
        guard.state = 1;
        guard.pauseFollow();
        this.physics.moveTo(guard, player.x, player.y, 300);
        this.sfxAlert.play()

    }

    returnToPath(guard){
        this.physics.moveTo(guard, guard.storeX, guard.storeY, 300, 3000);
        guard.state = 3;
        this.timeRemaining = this.time.delayedCall(3000, () => {
            guard.body.setVelocityX(0);
            guard.body.setVelocityY(0);
            console.log("Setting guard velocity to 0");
            guard.resumeFollow();
            guard.state = 0;
        }, null, this);
    }

}
