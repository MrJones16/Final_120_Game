class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        this.load.image('player_yellow', './assets/sprite_boy_Y.png');
        this.load.image('player_green', './assets/sprite_boy_G.png');
        this.load.image('player_pink', './assets/sprite_boy_P.png');
        this.load.image('wall', './assets/Stand.png');
        this.load.image('clique_green', './assets/sprite_NPC_G.png');
        this.load.image('clique_yellow', './assets/sprite_NPC_Y.png');
        this.load.image('clique_pink', './assets/sprite_NPC_P.png');
        this.load.image('guard', './assets/sprite_Officer.png');
        this.load.image('store_green', './assets/sprite_rack_G.png');
        this.load.image('store_yellow', './assets/sprite_rack_Y.png');
        this.load.image('store_pink', './assets/sprite_rack_P.png');
        this.load.image('red_keycard', './assets/redKeyCard.png');
        this.load.image('blue_keycard', './assets/blueKeyCard.png');
        this.load.image('pink_keycard', './assets/pinkKeyCard.png');
        this.load.image('goal', './assets/placeholder_goal.png');
        this.load.audio('sfx_alert', './assets/alert.wav');
        this.load.audio('sfx_clothes', './assets/change_clothes.wav');
        this.load.audio('sfx_hello', './assets/hello.wav');
        this.load.audio('sfx_touch', './assets/guard_touch.wav');
        this.load.audio('sfx_collect', './assets/keycard_collect.wav');
        this.load.audio('bgm_alert', './assets/POL-elevators-short.wav');
        this.load.image('floor_bg', './assets/Floor.png');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        this.load.atlas('guard_atlas', './assets/sprite_Officer_anim.png', './assets/sprite_Officer_anim.json');
        this.load.atlas('clique_y_atlas', './assets/sprite_NPC_Y_anim1-sheet.png', './assets/sprite_NPC_Y_anim1-sheet.json');
        this.load.atlas('clique_g_atlas', './assets/sprite_NPC_G_anim1-sheet.png', './assets/sprite_NPC_G_anim1-sheet.json');
        this.load.atlas('clique_p_atlas', './assets/sprite_NPC_P_anim1-sheet.png', './assets/sprite_NPC_P_anim1-sheet.json');
        this.load.atlas('goal_atlas', './assets/Door.png', './assets/Door.json');
        // this.load.spritesheet('helicopter', './assets/helicopter-sheet.png', { frameWidth: 128, frameHeight: 64 });
        switch (currentLevel){
            case 1:
                this.load.tilemapTiledJSON("level1", "./assets/Level1.json");
                this.load.audio('bgm_easy', './assets/POL-jazzy-duck-short.wav');
                break;
            case 2:
                this.load.tilemapTiledJSON("level2", "./assets/Level2.json");
                this.load.audio('bgm_easy', './assets/POL-jazzy-duck-short.wav');
                break;
            case 3:
                this.load.tilemapTiledJSON("level3", "./assets/tilemap_level1_fixed.json");
                this.load.audio('bgm_medium', './assets/POL-8-ball-cafe-short.wav');
                break;
            case 4:
                this.load.tilemapTiledJSON("level4", "./assets/tilemap_level4.json");
                this.load.audio('bgm_medium', './assets/POL-8-ball-cafe-short.wav');
                break;
            case 5:
                this.load.tilemapTiledJSON("level5", "./assets/tilemap_level5.json");
                this.load.audio('bgm_hard', './assets/POL-lone-wolf-short.wav');
                break;
            default:
                break;
        }
        this.load.image('test_tileset', "./assets/test_tileset.png");
        this.load.image('MallTileSet', "./assets/MallTileSet.png");
    }
    
    

    create(){
        this.add.tileSprite(0, 0, game.config.width * 4, game.config.height * 4, 'floor_bg').setOrigin(0, 0).setScale(0.5);
        //Guard Vision Range:
        this.visionRange = 225;
        this.CLIQUETIME = 480;
        //clothes sound bool
        this.changeClothesSound = false;
        //initialize path graphics FOR DEBUGGING
        this.graphics = this.add.graphics();
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        //music bool
        musicStarted = true;
        //Add animations
        this.createPlayerAnims();
        this.createGuardAnims();
        this.createCliqueAnims();
        this.createDoorAnims();
    
        this.statusConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            fontStyle: 'bold',
            color: 'yellow',
            backgroundColor: 'khaki',
            stroke: 'black',
            strokeThickness: 5,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }
        this.statusText = this.add.text(game.config.width - (borderUISize + borderPadding * 15), borderUISize + borderPadding, "Unsafe", this.statusConfig).setScrollFactor(0,0);

        this.keycardAmount = 0;
        this.openedExit = false;
        this.lockoutShow = false;
        this.gameOverShow = false;
        this.helloPlayed = false;
        
        //Camera and world bounds stuff
        this.physics.world.setBounds(0, 0, game.config.width * 2, game.config.height * 2);
        //this.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, game.config.width * 2, game.config.height * 2);
        //this.cameras.main.startFollow(this.player);

        //SFX
        this.sfxAlert = this.sound.add('sfx_alert', {volume: 0.5});
        this.sfxClothes = this.sound.add('sfx_clothes', {volume: 0.65});
        this.sfxTouch = this.sound.add('sfx_touch', {volume: 0.75});
        this.sfxCollect = this.sound.add('sfx_collect', {volume: 0.75});
        this.sfxHello = this.sound.add('sfx_hello', {volume: 0.65});

        //BGM
        if ((currentLevel == 1) || (currentLevel == 2)){
            this.bgmNormal = this.sound.add('bgm_easy', {volume: 0.2, loop: true, rate: 0.95});
        } else if ((currentLevel == 3) || (currentLevel == 4)){
            this.bgmNormal = this.sound.add('bgm_medium', {volume: 0.2, loop: true, rate: 0.95});
        } else if (currentLevel == 5){
            this.bgmNormal = this.sound.add('bgm_hard', {volume: 0.2, loop: true, rate: 0.95});
        }
        this.bgmAlert = this.sound.add('bgm_alert', {volume: 0.2, loop: true, rate: 1.05});
        this.bgmPlaying = 0;
        this.bgmNormal.play();

        //Timer text config
        this.timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            fontStyle: 'bold',
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

        //TEMPORARY CHEAT TO GET TO DIFFERENT LEVELS
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        //Group creations (must be before level loading)
        this.cliqueGroup = this.physics.add.group();
        this.storeGroup = this.physics.add.group();
        // this.wallGroup = this.physics.add.group();
        this.guardGroup = this.physics.add.group();
        this.goalGroup = this.physics.add.group();
        this.keycardGroup = this.physics.add.group();

        //Different level loading
        switch (currentLevel){
            //Level 1
            case 1:
                //this.loadLevel("level1");
                //this.keycardLevel = false;
                this.loadLevel("level1");
                this.keycardAmount = 0;
                break;
            //TEMP LEVEL LOADS SO GAME DOESN'T CRASH WHEN GOING TO FUTURE LEVELS WITH NOTHING IN THEM
            //The scene loads are here just so I could test the level load screens.
            //I highly suggest reloading the game if you complete the level or press P to skip to next level when this code is here. Or your ears will be destroyed
            //Level 2
            case 2:
                this.loadLevel("level2");
                this.keycardAmount = 1;
                break;
            //Level 3
            case 3:
                this.loadLevel("level3");
                this.keycardAmount = 3;
                break;
            case 4:
                this.loadLevel("level4");
                this.keycardAmount = 3;
                break;
            //Level 4
            case 5:
                this.loadLevel("level5");
                this.keycardAmount = 3;
                break;
            //Level 5
            case 6:
                this.scene.start('levelLoadScene');
                break;
        }

        //Keycard text setup
        if (this.keycardAmount > 0){
            this.keycardConfig = {
                fontFamily: 'Courier',
                fontSize: '40px',
                fontStyle: 'bold',
                color: 'royalblue',
                backgroundColor: 'lightskyblue',
                stroke: 'black',
                strokeThickness: 5,
                align: 'center',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 350
            }
            this.keycardText = this.add.text(game.config.width - (borderUISize + borderPadding * 72), borderUISize + borderPadding, "Keycards: ", this.keycardConfig).setScrollFactor(0,0);
            this.keycardText.setDepth(100);
        }

        //Player collisions and overlaps
        //this.physics.add.collider(this.player, wallLayer);
        this.physics.add.overlap(this.player, this.cliqueGroup, (player, clique) => {
            if (clique.type == this.player.type && !this.player.cliqueLockout){
                this.player.touchClique = true;
                clique.touching = true;
                clique.isActive = true;
            } else {
                this.player.status = 2;
            }
        });

        //Player touches goal/exit of level, go to next
        this.physics.add.collider(this.player, this.goalGroup, () => {
            if (this.openedExit){
                this.stopMusicPlay();
                if (currentLevel == 5) {
                    this.scene.start('victoryScene');
                } else {
                    this.scene.start('levelLoadScene');
                }
            }
        });

        //player and store interation
        this.physics.add.overlap(this.player, this.storeGroup, (player, store) => {
            if (keySPACE.isDown) {
                if (store.texture.key == 'store_yellow'){
                    this.player.anims.play('idle_down_yellow');
                    this.player.type = 0;
                    if (!this.changeClothesSound){
                        this.sfxClothes.play();
                        this.changeClothesSound = true;
                        this.time.delayedCall(1000, () => {
                            this.changeClothesSound = false;
                        }, null, this);
                    }
                } else if (store.texture.key == 'store_green'){
                    this.player.anims.play('idle_down_green');
                    this.player.type = 1;
                    if (!this.changeClothesSound){
                        this.sfxClothes.play();
                        this.changeClothesSound = true;
                        this.time.delayedCall(1000, () => {
                            this.changeClothesSound = false;
                        }, null, this);
                    }
                } else if (store.texture.key == 'store_pink'){
                    this.player.anims.play('idle_down_pink');
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


        //this.physics.add.collider(this.guardGroup, this.wallGroup);
        this.physics.add.collider(this.guardGroup, this.player, (guard, player) => {
            //Guard collides with player
            this.openedExit = false;
            //handle actual game over stuff here
            if(!this.gameOverShow && this.player.status == 2){
                this.statusConfig.color = 'red';
                this.statusConfig.backgroundColor = 'lightcoral';
                this.statusConfig.fontSize = 72;
                this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, "GAME", this.statusConfig).setOrigin(0.5).setScrollFactor(0,0);
                this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding + 75, "OVER", this.statusConfig).setOrigin(0.5).setScrollFactor(0,0);
                this.statusConfig.fontSize = 40;
                this.gameOverShow = true;
                this.sfxTouch.play();
                this.stopMusicPlay();
                this.time.delayedCall(1000, () => {
                    this.scene.start('gameOverScene');
                    this.stopMusicPlay();
                }, null, this);
            }     
        });

        //Collect keycard
        this.physics.add.overlap(this.player, this.keycardGroup, (player, keycard) => {
            keycard.destroy();
            this.sfxCollect.play();
            this.player.keycards += 1;
        });

        //Original keycard y pos
        if (this.keycardAmount > 0){
            this.keycardGroup.getChildren().forEach((keycard) => {
                keycard.origY = keycard.y;
                keycard.moveUp = true;
            });
        }

        this.goalGroup.getChildren().forEach((goal) => {
            goal.anims.play('door_closed');
        });

        this.statusText.setDepth(100);

    }
    
    update(time, delta) {
        this.physics.world.setFPS(60);

        //BGM updating
        if (this.player.status == 2 && this.bgmPlaying == 0) {
            this.bgmNormal.stop();
            this.bgmAlert.play();
            this.bgmPlaying = 1;
            this.cameras.main.shake(100, 0.01);
        } else if (this.player.status != 2 && this.bgmPlaying == 1) {
            this.bgmAlert.stop();
            this.bgmNormal.play();
            this.bgmPlaying = 0;
        }
        
        //Player movement (preferred to move into player prefab; further debugging for that is required)
        this.whichRun(this.player);
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
            this.whichIdle(this.player);
        }

        //LEVEL CHEAT (TEMP)
        if (keyP.isDown) {
            this.stopMusicPlay();
            if (currentLevel == 5) {
                this.scene.start('victoryScene');
            } else {
                this.scene.start('levelLoadScene');
            }
        }

        // Clique touching player flag reset
        if (!this.player.touchClique) {
            this.cliqueGroup.getChildren().forEach((clique) => {
                clique.touching = false;
            });
        }

        // Individual clique timer code
        this.cliqueGroup.getChildren().forEach((clique) => {
            if ((!clique.touching || this.player.status == 2) && clique.timer < this.CLIQUETIME) {
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
            if (clique.timer == this.CLIQUETIME){
                clique.timeText.setAlpha(0);
                clique.isActive = false;
            }
            if (clique.isActive) {
                clique.timeText.setAlpha(100);
                clique.timeText.text = Math.trunc(clique.timer / 60);
            }
        });

        //Clique lockout
        if (this.player.cliqueLockout && !this.lockoutShow) {
            this.lockoutShow = true;
            this.statusConfig.color = 'red';
            this.statusConfig.backgroundColor = 'lightcoral';
            this.lockoutText = this.add.text(game.config.width - (borderUISize + borderPadding * 15), borderUISize + borderPadding * 4, "[LOCKED]", this.statusConfig).setScrollFactor(0,0);
            this.lockoutTimer = this.time.delayedCall(10000, () => {
                this.player.cliqueLockout = false;
                this.lockoutText.destroy();
                this.lockoutShow = false;
            }, null, this); 
        }

        //Clique collision and timer
        if (this.player.touchClique && !this.player.cliqueLockout) {
            this.player.status = 1;
        } else {
            if (this.player.status != 2) {
                this.player.status = 0;
            }
        }

        //Keycard movement
        if (this.keycardAmount > 0){
            this.keycardGroup.getChildren().forEach((keycard) => {
                if (keycard.y < keycard.origY - 10){
                    keycard.moveUp = false;
                } else if (keycard.y > keycard.origY){
                    keycard.moveUp = true;
                }
                if (keycard.moveUp){
                    keycard.y -= 1;
                } else {
                    keycard.y += 1;
                }
            });
        }

        //Player status
        switch (this.player.status){
            //Player is unsafe (not hiding, but not spotted)
            case 0:
                this.statusText.setColor('yellow');
                this.statusText.text = "Unsafe";
                this.statusText.setBackgroundColor('khaki');
                this.helloPlayed = false;
                break;
            //Player is safe (hiding)
            case 1:
                this.statusText.setColor('lime');
                this.statusText.text = "Safe";
                this.statusText.setBackgroundColor('palegreen');
                if (!this.helloPlayed){
                    this.sfxHello.play();
                    this.helloPlayed = true;
                }
                break;
            //Player is found (spotted)
            case 2:
                this.statusText.setColor('red');
                this.statusText.text = "Found!";
                this.statusText.setBackgroundColor('lightcoral');
                break;
        }

        //Keycard counter and open exit
        if (this.keycardAmount > 0){
            if (this.player.keycards == this.keycardAmount){
                this.keycardText.text = "Exit opened!";
                if (!this.openedExit) {
                    this.goalGroup.getChildren().forEach((goal) => {
                        goal.anims.play('door_open');
                    });
                    this.openedExit = true;
                }
            } else {
                this.keycardText.text = "Keycards: " + this.player.keycards + "/" + this.keycardAmount;
            }
        } else if (this.keycardAmount == 0) {
            if (!this.openedExit) {
                this.goalGroup.getChildren().forEach((goal) => {
                    goal.anims.play('door_open');
                });
                this.openedExit = true;
            }
        }
        
        //updating the guards
        this.guardGroup.getChildren().forEach((guard) => {
            guard.detectionRadius.x = guard.x;
            guard.detectionRadius.y = guard.y;
            guard.path.getPoint(guard.follower.t, guard.follower.vec);
            switch(guard.state){
                case(0)://patrolling 
                    //Animation
                    if ((guard.follower.vec.x < guard.x) && (guard.animPlaying == 1)) {
                        guard.anims.play('guard_walk_left');
                        guard.animPlaying = 0;
                    }
                    else if ((guard.follower.vec.x >= guard.x) && (guard.animPlaying == 0)) {
                        guard.anims.play('guard_walk_right');
                        guard.animPlaying = 1;
                    }
                    //moving the guard on the path
                    guard.x = guard.follower.vec.x;
                    guard.y = guard.follower.vec.y;
                    //checking for the player
                    if (Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y) <= this.visionRange && this.player.status == 0){
                        this.playerSpotted(guard, this.player);
                        //console.log("Player is in range to begin hunting");
                    } else if (this.player.status == 2){
                        this.playerSpotted(guard, this.player);
                        //console.log("Player is in range to begin hunting");
                    }
                    if (guard.detectionRadius.alpha != 0.05){
                        guard.detectionRadius.setAlpha(0.05);
                    }
                    break;
                case(1)://hunting player
                    this.physics.moveTo(guard, this.player.x, this.player.y, 285);
                    //Animation
                    if ((this.player.x < guard.x) && (guard.animPlaying == 1)) {
                        guard.anims.play('guard_walk_left');
                        guard.animPlaying = 0;
                    }
                    else if ((this.player.x >= guard.x) && (guard.animPlaying == 0)) {
                        guard.anims.play('guard_walk_right');
                        guard.animPlaying = 1;
                    }
                    //console.log("moving to player");
                    if (this.player.status == 1){
                        this.returnToPath(guard);
                        //console.log("player is safe, go back to path");
                    }
                    if (guard.detectionRadius.alpha != 0){
                        guard.detectionRadius.setAlpha(0);
                    }
                    break;
                case (2)://going back to path
                    this.physics.moveTo(guard, guard.storeX, guard.storeY, 270);
                    //Animation
                    if ((guard.storeX < guard.x) && (guard.animPlaying == 1)) {
                        guard.anims.play('guard_walk_left');
                        guard.animPlaying = 0;
                    }
                    else if ((guard.storeX >= guard.x) && (guard.animPlaying == 0)) {
                        guard.anims.play('guard_walk_right');
                        guard.animPlaying = 1;
                    }

                    //locking onto path when in range of last spot
                    let xdif = guard.x - guard.storeX;
                    let ydif = guard.y - guard.storeY;
                    if (xdif > -1.5 && xdif < 1.5){
                        guard.state = 0;
                        guard.delcall.destroy();
                        guard.body.setVelocityX(0);
                        guard.body.setVelocityY(0);
                        //console.log("Setting guard velocity to 0");
                        guard.tween.resume();
                    }
                    if (ydif > -1 && ydif < 1){
                        guard.state = 0;
                        guard.delcall.destroy();
                        guard.body.setVelocityX(0);
                        guard.body.setVelocityY(0);
                        //console.log("Setting guard velocity to 0");
                        guard.tween.resume();
                    }
                    if (guard.detectionRadius.alpha != 0.05){
                        guard.detectionRadius.setAlpha(0.05);
                    }
                    break;
                default:
                    break;
            }
        });

        this.player.touchClique = false;
    }

    playerSpotted(guard, player){
        //console.log("Player Spotted");
        guard.storeX = guard.x;
        guard.storeY = guard.y;
        guard.state = 1;
        guard.tween.pause();
        this.physics.moveTo(guard, player.x, player.y, 300);
        this.sfxAlert.play();
        player.status = 2;
    }

    returnToPath(guard){
        this.physics.moveTo(guard, guard.storeX, guard.storeY, 300, 3000);
        guard.state = 2;
        //console.log("calling return to path");
        guard.delcall = this.time.delayedCall(3000, () => {
            guard.body.setVelocityX(0);
            guard.body.setVelocityY(0);
            //console.log("Setting guard velocity to 0");
            guard.tween.resume();
            guard.state = 0;
        }, null, this);
    }

    stopMusicPlay(){
        if (this.bgmPlaying == 0){
            this.bgmNormal.stop();
        } else {
            this.bgmAlert.stop();
        }
    }

    createPlayer(x, y){
        this.player = this.physics.add.sprite(x, y, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.player.anims.play('idle_down_yellow');
        this.player.type = 0;
        this.player.touchClique = false;
        this.player.cliqueLockout = false;
        this.player.status = 0;
        this.player.keycards = 0;
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player);
    }

    createClique(x, y, type){
        let clique;
        if (type == 0){
            clique = this.physics.add.sprite(x - 20, y - 60, 'clique_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
            clique.anims.play('clique_y_anim');
        } else if (type == 1){
            clique = this.physics.add.sprite(x - 20, y - 60, 'clique_green').setOrigin(0, 0).setImmovable(true).setScale(0.5);
            clique.anims.play('clique_g_anim');
        } else if (type == 2){
            clique = this.physics.add.sprite(x - 20, y - 60, 'clique_pink').setOrigin(0, 0).setImmovable(true).setScale(0.5);
            clique.anims.play('clique_p_anim');
        }
        clique.type = type;
        clique.timer = this.CLIQUETIME;
        clique.isActive = false;
        clique.touching = false;
        clique.timeText = this.add.text(clique.x - 45, clique.y - 35, Math.trunc(clique.timer / 60), this.timerConfig);
        clique.timeText.setAlpha(0);
        this.cliqueGroup.add(clique);
    }

    createGuard(x, y){
        let guard = this.physics.add.sprite(x,y,'guard').setScale(0.5);
        guard.anims.play('guard_walk_left');
        guard.animPlaying = 0;
        this.guardGroup.add(guard);
        guard.detectionRadius = this.add.circle(x, y, this.visionRange, 0x4d4b08).setAlpha(0.05);
        guard.storeX = 0;
        guard.storeY = 0;
        guard.state = 0;
        guard.path = new Phaser.Curves.Path(x,y);
        guard.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        guard.tween = this.tweens.add({
            targets: guard.follower,
            t: 1,
            delay:2000,
            ease: 'Linear',
            duration: 10000,
            hold:2000,
            yoyo: true,
            repeat: -1
        });
        return guard;
    }

    GuardLineTo(guard, x, y){
        guard.path.lineTo(x,y);
    }

    createGuardPath(guard, x, y, pathArray){
        var currx = x;
        var curry = y;
        let index = 0;
        //sorting the array by distance to the next point
        for (let i = 0; i < pathArray.length; ++i){
            let minDistance = 1000;
            for (let j = i; j < pathArray.length; ++j){
                //find closest point to current path spot
                let distance = Phaser.Math.Distance.Between(currx,curry, pathArray[j].x, pathArray[j].y);
                if (distance < minDistance){
                    minDistance = distance;
                    index = j;
                }
                
            }
            //Swap elements
            let temp = pathArray[i];
            pathArray[i] = pathArray[index];
            pathArray[index] = temp;
            //set next position to new path spot
            currx = pathArray[i].x;
            curry = pathArray[i].y;
        }
        //now that the array is sorted by their distance to the next point in the array, 
        //go through the array and extend the path accordingly if the distance is small enough
        currx = x;
        curry = y;
        for (let k = 0; k < pathArray.length; ++k){
            let distance = Phaser.Math.Distance.Between(currx,curry, pathArray[k].x, pathArray[k].y);
            if (distance < 100){ // enough to make diagonals count :)
                currx = pathArray[k].x;
                curry = pathArray[k].y;
                this.GuardLineTo(guard, currx, curry);
            }else{
                return;
            }
        }
        
    }

    loadLevel(levelstr){
        //Load tilemap and tileset, create layers
        const map1 = this.add.tilemap(levelstr);
        const tileset1 = map1.addTilesetImage("MallTileSet", null, 64, 64, 1, 2);
        const backgroundLayer = map1.createLayer("Background", tileset1, 0, 0);
        //Create player after background and before everything else
        const playerSpawn = map1.findObject("Player", obj => obj.name === "player");
        this.createPlayer(playerSpawn.x, playerSpawn.y);
        //Walls and collision
        const wallLayer = map1.createLayer("Walls", tileset1, 0, 0);
        wallLayer.setCollisionByProperty({ 
            collides: true 
        });
        //Camera and world bounds stuff
        this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
        //this.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
        //this.cameras.main.startFollow(this.player);
        //Placing game objects at respective Tiled objects positions
        map1.filterObjects("Objects", (obj) => {
            //Create cliques
            if (obj.name == 'p_clique'){
                this.createClique(obj.x, obj.y, 2);
            }
            if (obj.name == 'g_clique'){
                this.createClique(obj.x, obj.y, 1);
            }
            if (obj.name == 'y_clique'){
                this.createClique(obj.x, obj.y, 0);
            }
            //Create stores
            if (obj.name == 'p_store'){
                this.storeGroup.create(obj.x, obj.y - 75, 'store_pink').setOrigin(0, 0).setImmovable(true).setScale(0.5);
            }
            if (obj.name == 'g_store'){
                this.storeGroup.create(obj.x, obj.y - 75, 'store_green').setOrigin(0, 0).setImmovable(true).setScale(0.5);
            }
            if (obj.name == 'y_store'){
                this.storeGroup.create(obj.x, obj.y - 75, 'store_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
            }
            if (obj.name == 'guard'){
                let path_array = map1.filterObjects("Objects", obj => obj.name === "path");
                let guard = this.createGuard(obj.x, obj.y);
                this.createGuardPath(guard, obj.x, obj.y, path_array);
                for (let i = 0; i < path_array.length; ++i){
                    delete path_array[i];
                }
            }        
            //Create goal
            if (obj.name == 'level_goal'){
                this.goalGroup.create(obj.x, obj.y - 100, 'goal').setImmovable(true);
            }
            //Create keycards
            if (obj.name == 'p_keycard'){
                this.keycardGroup.create(obj.x, obj.y - 75, 'pink_keycard').setOrigin(0, 0).setScale(0.65);
            }
            if (obj.name == 'b_keycard'){
                this.keycardGroup.create(obj.x, obj.y - 75, 'blue_keycard').setOrigin(0, 0).setScale(0.65);
            }
            if (obj.name == 'r_keycard'){
                this.keycardGroup.create(obj.x, obj.y - 75, 'red_keycard').setOrigin(0, 0).setScale(0.65);
            }
        });
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.guardGroup, wallLayer);
    }


    // Figure out what current anim should be
    // 0 = yellow, 1 = green, 2 = pink
    determineAnim(player, anim){
        switch (player.type){
            case 0:
                switch (anim){
                    case 'idle_down':
                        this.player.anims.play('idle_down_yellow');
                        break;
                    case 'idle_up':
                        this.player.anims.play('idle_up_yellow');
                        break;
                    case 'idle_left':
                        this.player.anims.play('idle_left_yellow');
                        break;
                    case 'idle_right':
                        this.player.anims.play('idle_right_yellow');
                        break;
                    case 'run_down':
                        this.player.anims.play('run_down_yellow', true);
                        break;
                    case 'run_up':
                        this.player.anims.play('run_up_yellow', true);
                        break;
                    case 'run_left':
                        this.player.anims.play('run_left_yellow', true);
                        break;
                    case 'run_right':
                        this.player.anims.play('run_right_yellow', true);
                        break;
                }
                break;
            case 1:
                switch (anim){
                    case 'idle_down':
                        this.player.anims.play('idle_down_green');
                        break;
                    case 'idle_up':
                        this.player.anims.play('idle_up_green');
                        break;
                    case 'idle_left':
                        this.player.anims.play('idle_left_green');
                        break;
                    case 'idle_right':
                        this.player.anims.play('idle_right_green');
                        break;
                    case 'run_down':
                        this.player.anims.play('run_down_green', true);
                        break;
                    case 'run_up':
                        this.player.anims.play('run_up_green', true);
                        break;
                    case 'run_left':
                        this.player.anims.play('run_left_green', true);
                        break;
                    case 'run_right':
                        this.player.anims.play('run_right_green', true);
                        break;
                }
                break;
            case 2:
                switch (anim){
                    case 'idle_down':
                        this.player.anims.play('idle_down_pink');
                        break;
                    case 'idle_up':
                        this.player.anims.play('idle_up_pink');
                        break;
                    case 'idle_left':
                        this.player.anims.play('idle_left_pink');
                        break;
                    case 'idle_right':
                        this.player.anims.play('idle_right_pink');
                        break;
                    case 'run_down':
                        this.player.anims.play('run_down_pink', true);
                        break;
                    case 'run_up':
                        this.player.anims.play('run_up_pink', true);
                        break;
                    case 'run_left':
                        this.player.anims.play('run_left_pink', true);
                        break;
                    case 'run_right':
                        this.player.anims.play('run_right_pink', true);
                        break;
                }
                break;
        }
    }

    // Find out what idle anim to play
    whichIdle(player){
        if (this.player.anims.currentAnim.key == 'run_up_pink' || this.player.anims.currentAnim.key == 'run_up_yellow' || this.player.anims.currentAnim.key == 'run_up_green'){
            this.determineAnim(player, 'idle_up');
        }
        if (this.player.anims.currentAnim.key == 'run_down_pink' || this.player.anims.currentAnim.key == 'run_down_yellow' || this.player.anims.currentAnim.key == 'run_down_green'){
            this.determineAnim(player, 'idle_down');
        }
        if (this.player.anims.currentAnim.key == 'run_left_pink' || this.player.anims.currentAnim.key == 'run_left_yellow' || this.player.anims.currentAnim.key == 'run_left_green'){
            this.determineAnim(player, 'idle_left');
        }
        if (this.player.anims.currentAnim.key == 'run_right_pink' || this.player.anims.currentAnim.key == 'run_right_yellow' || this.player.anims.currentAnim.key == 'run_right_green'){
            this.determineAnim(player, 'idle_right');
        }
    }

    //Find out which run to play (needed for diagonal movement)
    whichRun(player){
        if ((keyA.isDown && !keyD.isDown && !keyW.isDown && !keyS.isDown) || (keyA.isDown && !keyD.isDown && keyW.isDown && !keyS.isDown) || (keyA.isDown && !keyD.isDown && !keyW.isDown && keyS.isDown)) {
            this.determineAnim(this.player, 'run_left');
        }
        else if ((!keyA.isDown && keyD.isDown && !keyW.isDown && !keyS.isDown) || (!keyA.isDown && keyD.isDown && keyW.isDown && !keyS.isDown) || (!keyA.isDown && keyD.isDown && !keyW.isDown && keyS.isDown)) {
            this.determineAnim(this.player, 'run_right');
        }
        else if (!keyA.isDown && !keyD.isDown && keyW.isDown && !keyS.isDown) {
            this.determineAnim(this.player, 'run_up');
        }
        else if (!keyA.isDown && !keyD.isDown && !keyW.isDown && keyS.isDown) {
            this.determineAnim(this.player, 'run_down');
        }
    }

    createGuardAnims(){
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
    }

    createCliqueAnims(){
        this.anims.create({
            key: 'clique_y_anim',
            frames: this.anims.generateFrameNames('clique_y_atlas', {
                prefix: 'clique_y_',
                start: 1,
                end: 2,
            }),
            frameRate: 10,
            repeat: -1,
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
            key: 'clique_p_anim',
            frames: this.anims.generateFrameNames('clique_p_atlas', {
                prefix: 'clique_p_',
                start: 1,
                end: 2,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    createDoorAnims(){
        this.anims.create({
            key: 'door_closed',
            frames: this.anims.generateFrameNames('goal_atlas', {
                prefix: 'door',
                start: 1,
                end: 1,
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
    }

    // Set up animations
    createPlayerAnims(){
        // Idle down green
        this.anims.create({
            key: 'idle_down_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_down_',
                start: 1,
                end: 1,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle down pink
        this.anims.create({
            key: 'idle_down_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_down_',
                start: 1,
                end: 1,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle down yellow
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
        // Idle up green
        this.anims.create({
            key: 'idle_up_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_up_',
                start: 2,
                end: 2,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle up pink
        this.anims.create({
            key: 'idle_up_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_up_',
                start: 2,
                end: 2,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle up green
        this.anims.create({
            key: 'idle_up_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_up_',
                start: 2,
                end: 2,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle left green
        this.anims.create({
            key: 'idle_left_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_left_',
                start: 1,
                end: 1,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle left pink
        this.anims.create({
            key: 'idle_left_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_left_',
                start: 1,
                end: 1,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle left yellow
        this.anims.create({
            key: 'idle_left_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_left_',
                start: 1,
                end: 1,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle right green
        this.anims.create({
            key: 'idle_right_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_right_',
                start: 1,
                end: 1,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle right pink
        this.anims.create({
            key: 'idle_right_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_right_',
                start: 1,
                end: 1,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Idle right yellow
        this.anims.create({
            key: 'idle_right_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_right_',
                start: 1,
                end: 1,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1,
        });
        // Run down green
        this.anims.create({
            key: 'run_down_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_down_',
                start: 1,
                end: 3,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run down pink
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
        // Run down yellow
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
        // Run up green
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
        // Run up pink
        this.anims.create({
            key: 'run_up_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_up_',
                start: 1,
                end: 3,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run up yellow
        this.anims.create({
            key: 'run_up_yellow',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_up_',
                start: 1,
                end: 3,
                suffix: '_yellow',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run left green
        this.anims.create({
            key: 'run_left_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_left_',
                start: 1,
                end: 2,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run left pink
        this.anims.create({
            key: 'run_left_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_left_',
                start: 1,
                end: 2,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run left yellow
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
        // Run right green
        this.anims.create({
            key: 'run_right_green',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_right_',
                start: 1,
                end: 2,
                suffix: '_green',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run right pink
        this.anims.create({
            key: 'run_right_pink',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'player_right_',
                start: 1,
                end: 2,
                suffix: '_pink',
            }),
            frameRate: 15,
            repeat: -1
        });
        // Run right yellow
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
    }

}
