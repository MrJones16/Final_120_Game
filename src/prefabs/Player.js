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

    }
    reset() {

    }
}