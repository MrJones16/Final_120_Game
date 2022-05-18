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
        this.load.image('store_green', './assets/placeholder_store_green.png');
        this.load.image('store_yellow', './assets/placeholder_store_yellow.png');
        this.load.image('store_pink', './assets/placeholder_store_pink.png');
        this.load.audio('sfx_alert', './assets/alert.wav');
        this.load.audio('sfx_clothes', './assets/change_clothes.wav');
        this.load.audio('bgm_alert', './assets/POL-elevators-short.wav');
        this.load.audio('bgm_normal', './assets/POL-jazzy-duck-short.wav');
        this.load.image('floor_bg', './assets/Floor.png');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        // this.load.spritesheet('helicopter', './assets/helicopter-sheet.png', { frameWidth: 128, frameHeight: 64 });
    }
    
    

    create(){
        this.add.tileSprite(0, 0, game.config.width * 4, game.config.height * 4, 'floor_bg').setOrigin(0, 0).setScale(0.5);
        //var to show guard paths
        this.showpath = false;
        //Guard Vision Range:
        this.visionRange = 200;
        //clothes sound bool
        this.changeClothesSound = false;
        //initialize path graphics FOR DEBUGGING
        this.graphics = this.add.graphics();
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        //music bool
        musicStarted = true;
        //Add player
        this.createPlayerAnims();
        //this.player = new Player(this, game.config.width / 2, game.config.height / 2, 'idle_down_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
        this.player.anims.play('idle_down_yellow');
        this.player.type = 0;
        this.player.touchClique = false;
        //this.player.timerActive = false;
        //this.player.timerExpired = false;
        this.player.cliqueLockout = false;
        this.player.status = 0;
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
        this.lockoutShow = false;
        this.gameOverShow = false;
        
        //Camera and world bounds stuff
        this.physics.world.setBounds(0, 0, game.config.width * 2, game.config.height * 2);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, game.config.width * 2, game.config.height * 2);
        this.cameras.main.startFollow(this.player);

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
        this.wallGroup = this.physics.add.group();
        this.guardGroup = this.physics.add.group();

        //Different level loading
        switch (currentLevel){
            //Level 1
            case 1:
                //Level 1 clique creation
                this.cliqueGroup.create(250, 250, 'clique_green').setOrigin(0, 0).setImmovable(true).setScale(0.5);
                this.cliqueGroup.create(700, 500, 'clique_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
                this.cliqueGroup.create(1000, 150, 'clique_pink').setOrigin(0, 0).setImmovable(true).setScale(0.5);
                //Level 1 store creation
                this.storeGroup.create(500, 150, 'store_yellow').setOrigin(0, 0).setImmovable(true);
                this.storeGroup.create(1000, 550, 'store_green').setOrigin(0, 0).setImmovable(true);
                this.storeGroup.create(100, 550, 'store_pink').setOrigin(0, 0).setImmovable(true);
                //Level 1 walls creation
                this.wallGroup.create(100, 100, 'wall').setOrigin(0, 0).setImmovable(true);
                this.wallGroup.create(300, 400, 'wall').setOrigin(0, 0).setImmovable(true);
                this.wallGroup.create(800, 300, 'wall').setOrigin(0, 0).setImmovable(true);    
                //Level 1 guard creation
                //uncomment for guard paths//this.showpath = true;
                this.guard = this.createGuard(10,10);
                this.GuardLineTo(this.guard,750,10);
                this.GuardLineTo(this.guard,750,300);
                break;
            //Level 2
            case 2:
                //Level 2 clique creation
                this.cliqueGroup.create(100, 250, 'clique_green').setOrigin(0, 0).setImmovable(true).setScale(0.5);
                this.cliqueGroup.create(500, 250, 'clique_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
                this.cliqueGroup.create(900, 250, 'clique_pink').setOrigin(0, 0).setImmovable(true).setScale(0.5);
                //Level 2 store creation
                this.storeGroup.create(500, 500, 'store_yellow').setOrigin(0, 0).setImmovable(true);
                this.storeGroup.create(100, 500, 'store_green').setOrigin(0, 0).setImmovable(true);
                this.storeGroup.create(900, 500, 'store_pink').setOrigin(0, 0).setImmovable(true);
                //Level 2 walls creation
                this.wallGroup.create(0, -50, 'wall').setOrigin(0, 0).setImmovable(true);
                this.wallGroup.create(400, -50, 'wall').setOrigin(0, 0).setImmovable(true);
                this.wallGroup.create(800, -50, 'wall').setOrigin(0, 0).setImmovable(true);
                break;
            //Level 3
            case 3:
                
                break;
        }

        this.cliqueGroup.getChildren().forEach((clique) => {
            clique.timer = 330;
            clique.active = false;
            clique.touching = false;
            clique.timeText = this.add.text(clique.x - 45, clique.y - 35, Math.trunc(clique.timer / 60), this.timerConfig);
            clique.timeText.setAlpha(0);
            if (clique.texture.key == 'clique_yellow'){
                clique.type = 0;
            } else if (clique.texture.key == 'clique_green'){
                clique.type = 1;
            } else if (clique.texture.key == 'clique_pink'){
                clique.type = 2;
            }
        });

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


        this.physics.add.collider(this.guardGroup, this.wallGroup);
        this.physics.add.collider(this.guardGroup, this.player, (guard, player) => {
            //Guard collides with player

            //handle actual game over stuff here
            if(!this.gameOverShow && this.player.status == 2){
                this.statusConfig.color = 'red';
                this.statusConfig.fontSize = 72;
                this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, "GAME", this.statusConfig).setOrigin(0.5).setScrollFactor(0,0);
                this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding + 75, "OVER", this.statusConfig).setOrigin(0.5).setScrollFactor(0,0);
                this.statusConfig.fontSize = 40;
                this.gameOverShow = true;
                this.stopMusicPlay();
                this.time.delayedCall(1000, () => {
                    this.scene.start('menuScene');
                    this.stopMusicPlay();
                }, null, this);
            }     
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
            if (currentLevel == 3) {
                this.scene.start('menuScene');
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

        //Player status
        switch (this.player.status){
            //Player is unsafe (not hiding, but not spotted)
            case 0:
                this.statusText.setColor('yellow');
                this.statusText.text = "Unsafe";
                this.statusText.setBackgroundColor('khaki');
                break;
            //Player is safe (hiding)
            case 1:
                this.statusText.setColor('lime');
                this.statusText.text = "Safe";
                this.statusText.setBackgroundColor('palegreen');
                break;
            //Player is found (spotted)
            case 2:
                this.statusText.setColor('red');
                this.statusText.text = "Found!";
                this.statusText.setBackgroundColor('lightcoral');
                break;
        }

        
        //updating the guards
        this.guardGroup.getChildren().forEach((guard) => {
            guard.path.getPoint(guard.follower.t, guard.follower.vec);
            //draw the path for debugging
            if (this.showpath)
            guard.path.draw(this.graphics);
            switch(guard.state){
                case(0)://patrolling 
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
                    break;
                case(1)://hunting player
                    this.physics.moveTo(guard, this.player.x, this.player.y, 300);
                    //console.log("moving to player");
                    if (this.player.status == 1){
                        this.returnToPath(guard);
                        //console.log("player is safe, go back to path");
                    }
                    break;
                case (2)://going back to path
                    this.physics.moveTo(guard, guard.storeX, guard.storeY, 300);
                    //console.log("moving back to path");
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
        this.timeRemaining = this.time.delayedCall(3000, () => {
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

    createGuard(x, y){
        let guard = this.guardGroup.create(x, y, 'guard').setScale(0.5);
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
