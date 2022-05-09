class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        //adds object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    create() {
        
    }
    update() {
        // Player movement
        // if (keyA.isDown) {
        //     this.body.setVelocityX(-500);
        // } else if(keyD.isDown) {
        //     this.body.setVelocityX(500);
        // } else if(keyW.isDown) {
        //     this.body.setVelocityY(-500);
        // } else if(keyS.isDown) {
        //     this.body.setVelocityY(500);
        // } else if (!keyD.isDown && !keyA.isDown && !keyW.isDown && !keyS.isDown) {
        //     this.body.setVelocityX(0);
        //     this.body.setVelocityY(0);
        // }
    }
    reset() {

    }
}