class LevelLoad extends Phaser.Scene{
    constructor(){
        super("levelLoadScene");
    }
    preload(){
        this.load.image('floor_bg', './assets/biggerFloorTiles.png');
        this.load.atlas('clique_g_atlas', './assets/sprite_NPC_G_anim1-sheet.png', './assets/sprite_NPC_G_anim1-sheet.json');
        this.load.atlas('clique_p_atlas', './assets/sprite_NPC_P_anim1-sheet.png', './assets/sprite_NPC_P_anim1-sheet.json');
        this.load.image('clique_yellow', './assets/sprite_NPC_Y.png');
        this.load.atlas('player_atlas', './assets/sprite_boy_sheet.png', './assets/sprite_boy_sheet.json');
        this.load.image('player_yellow', './assets/sprite_boy_Y.png');
        this.load.image('guard', './assets/sprite_Officer.png');
        this.load.atlas('guard_atlas', './assets/sprite_Officer_anim.png', './assets/sprite_Officer_anim.json');
        this.load.image('store_green', './assets/sprite_rack_G.png');
        this.load.image('store_pink', './assets/sprite_rack_P.png');
        this.load.atlas('clique_y_atlas', './assets/sprite_NPC_Y_anim1-sheet.png', './assets/sprite_NPC_Y_anim1-sheet.json');
    }
    create(){
        this.background = this.add.tileSprite(0, 0, 1800, 1075, 'floor_bg').setOrigin(0, 0).setScale(0.8);
        currentLevel += 1;
        let levelTextConfig = {
          fontFamily: 'Century Gothic',
          fontSize: '72px',
          fontStyle: 'bold',
          color: 'dodgerblue',
          stroke: 'black',
          strokeThickness: 5,
          align: 'middle',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 150, "Level " + currentLevel, levelTextConfig).setOrigin(0.5);
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
        this.g_clique = this.physics.add.sprite(100, 100, 'clique_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
        this.g_clique.anims.play('clique_g_anim');
        this.p_clique = this.physics.add.sprite(1000, 100, 'clique_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
        this.p_clique.anims.play('clique_p_anim');
        this.p_clique = this.physics.add.sprite(550, 50, 'clique_yellow').setOrigin(0, 0).setImmovable(true).setScale(0.5);
        this.p_clique.anims.play('clique_y_anim');
        this.physics.add.sprite(850, 300, 'store_green').setOrigin(0, 0).setImmovable(true).setScale(0.5);
        this.physics.add.sprite(250, 300, 'store_pink').setOrigin(0, 0).setImmovable(true).setScale(0.5);

        this.playerY = this.physics.add.sprite(-100, 500, 'player_yellow').setOrigin(0.5, 0.5).setScale(0.75);
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
        this.playerY.anims.play('run_right_yellow');
        this.playerY.setVelocityX(250);

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
        if (currentLevel > 0){
            this.guard1 = this.physics.add.sprite(-500, 500, 'guard').setScale(0.5);
            this.guard1.anims.play('guard_walk_right');
            this.guard1.setVelocityX(310);
        }
        if (currentLevel > 1){
            this.guard2 = this.physics.add.sprite(-525, 475, 'guard').setScale(0.5);
            this.guard2.anims.play('guard_walk_right');
            this.guard2.setVelocityX(310);
        }
        if (currentLevel > 2){
            this.guard3 = this.physics.add.sprite(-550, 525, 'guard').setScale(0.5);
            this.guard3.anims.play('guard_walk_right');
            this.guard3.setVelocityX(310);
        }
        if (currentLevel > 3){
            this.guard4 = this.physics.add.sprite(-575, 490, 'guard').setScale(0.5);
            this.guard4.anims.play('guard_walk_right');
            this.guard4.setVelocityX(310);
        }
        if (currentLevel > 4){
            this.guard5 = this.physics.add.sprite(-600, 510, 'guard').setScale(0.5);
            this.guard5.anims.play('guard_walk_right');
            this.guard5.setVelocityX(310);
        }

        this.time.delayedCall(7500, () => {
            this.scene.start('playScene');
        }, null, this);

    }
}