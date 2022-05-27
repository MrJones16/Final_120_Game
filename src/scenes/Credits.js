class Credits extends Phaser.Scene{
    constructor(){
        super("creditsScene");
    }
    create(){ 
        let creditsConfig = {
            fontFamily: 'Century Gothic',
            fontSize: '72px',
            fontStyle: 'bold',
            color: 'mediumpurple',
            stroke: 'black',
            strokeThickness: 5,
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 350, "Credits", creditsConfig).setOrigin(0.5);
        creditsConfig.fontSize = '48px';
        creditsConfig.color = 'gold';
        this.menuButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 200, "Main Menu", creditsConfig).setOrigin(0.5).setInteractive();
        this.menuButton.on('pointerdown', () => { this.scene.start('menuScene'); })
        creditsConfig.color = 'mediumpurple';
        this.add.text(game.config.width/2 - 400, game.config.height/2 + borderUISize + borderPadding - 275, "Team", creditsConfig);
        this.add.text(game.config.width/2 + 250, game.config.height/2 + borderUISize + borderPadding - 275, "Music", creditsConfig);
        creditsConfig.fontStyle = 'normal';
        creditsConfig.fontSize = '28px';
        creditsConfig.align = 'left';
        creditsConfig.color = 'dodgerblue';
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding - 210, "Dominic Berardi", creditsConfig);
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding - 90, "Peyton Jones", creditsConfig);
        this.add.text(game.config.width/2 - 550, game.config.height/2 + borderUISize + borderPadding + 30, "Luis Acevedo", creditsConfig);
        creditsConfig.color = 'lightskyblue';
        creditsConfig.fontSize = '20px';
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 180, "Player, Clique, and Menu Programming", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 150, "Menu Design and Cutscene Animations", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 120, "Level Design", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 60, "Guard and AI Programming", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding - 30, "Level and Tutorial Design", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding, "Sound Effects", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding + 60, "Sprite Design", creditsConfig);
        this.add.text(game.config.width/2 - 500, game.config.height/2 + borderUISize + borderPadding + 90, "Object Animations", creditsConfig);
        creditsConfig.color = 'aquamarine';
        creditsConfig.fontSize = '16px';
        this.add.text(game.config.width/2 + 100, game.config.height/2 + borderUISize + borderPadding - 200, "“Pet Park”, from PlayOnLoop.com", creditsConfig);
        this.add.text(game.config.width/2 + 100, game.config.height/2 + borderUISize + borderPadding - 185, "Licensed under Creative Commons by Attribution 4.0", creditsConfig);
        this.add.text(game.config.width/2 + 100, game.config.height/2 + borderUISize + borderPadding - 150, "“Jazzy Duck”, from PlayOnLoop.com", creditsConfig);
        this.add.text(game.config.width/2 + 100, game.config.height/2 + borderUISize + borderPadding - 135, "Licensed under Creative Commons by Attribution 4.0", creditsConfig);
        this.add.text(game.config.width/2 + 100, game.config.height/2 + borderUISize + borderPadding - 100, "“Elevators”, from PlayOnLoop.com", creditsConfig);
        this.add.text(game.config.width/2 + 100, game.config.height/2 + borderUISize + borderPadding - 85, "Licensed under Creative Commons by Attribution 4.0", creditsConfig);
    }
}