class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key:'BootScene'
        });
    }
 
    preload() {
        this.load.spritesheet('buttons', 'assets/sprites/buttons.png', { frameWidth: 250, frameHeight: 49 });
        this.load.spritesheet('long_buttons', 'assets/sprites/long_buttons.png', { frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('units', 'assets/sprites/units.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('world', 'assets/sprites/world.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('grass', 'assets/sprites/grass.png');
        this.load.image('panel', 'assets/sprites/panel.png');
        this.load.image('game-panel', 'assets/sprites/game-panel.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.image('level-selector', 'assets/sprites/level-selector.png');

        this.load.spritesheet('tileset:effectsSmall', 'assets/sprites/effectsSmall.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('tileset:effectsLarge', 'assets/sprites/effectsLarge.png', { frameWidth: 64, frameHeight: 64 });
        
        this.load.bitmapFont('font:guiOutline', 'assets/fonts/guiOutline.png', 'assets/fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'assets/fonts/gui.png', 'assets/fonts/gui.xml');

        this.load.json('levels', 'assets/levels.json');
    }
 
    create() {
        //this.scene.start('LevelScene');
        this.scene.start('MainScene', {levelID:"001"});
    }
};