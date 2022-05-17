class LevelLoad extends Phaser.Scene{
    constructor(){
        super("levelLoadScene");
    }
    create(){
        currentLevel += 1;
        let levelTextConfig = {
          fontFamily: 'Rockwell',
          fontSize: '48px',
          fontStyle: 'bold',
          color: 'dodgerblue',
          align: 'middle',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 100, "Level " + currentLevel, levelTextConfig).setOrigin(0.5);
        this.time.delayedCall(2000, () => {
            this.scene.start('playScene');
        }, null, this);
    }
}