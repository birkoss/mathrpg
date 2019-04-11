class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key:'BootScene'
        });
    }
 
    preload() {
        this.load.image('popup:background', 'assets/sprites/popup_background.png');
        this.load.image('popup:inside_small', 'assets/sprites/popup_inside_small.png');
        this.load.image('popup:inside_medium', 'assets/sprites/popup_inside_medium.png');
        this.load.image('popup:inside_large', 'assets/sprites/popup_inside_large.png');

        this.load.spritesheet('buttons', 'assets/sprites/buttons.png', { frameWidth: 250, frameHeight: 49 });
        this.load.spritesheet('long_buttons', 'assets/sprites/long_buttons.png', { frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('small_buttons', 'assets/sprites/small_buttons.png', { frameWidth: 45, frameHeight: 49 });
        this.load.spritesheet('units', 'assets/sprites/units.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('world', 'assets/sprites/world.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('items', 'assets/sprites/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('grass', 'assets/sprites/grass.png');
        this.load.image('panel', 'assets/sprites/panel.png');
        this.load.image('question', 'assets/sprites/question.png');
        this.load.image('game-panel', 'assets/sprites/game-panel.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.image('star_large', 'assets/sprites/star_large.png');
        this.load.image('level-selector', 'assets/sprites/level-selector.png');
        this.load.image('arrow-left', 'assets/sprites/arrow_left.png');
        this.load.image('arrow-right', 'assets/sprites/arrow_right.png');
        this.load.image('padlock', 'assets/sprites/padlock.png');

        this.load.spritesheet('tileset:effectsSmall', 'assets/sprites/effectsSmall.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('tileset:effectsLarge', 'assets/sprites/effectsLarge.png', { frameWidth: 64, frameHeight: 64 });
        
        this.load.bitmapFont('font:guiOutline', 'assets/fonts/guiOutline.png', 'assets/fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'assets/fonts/gui.png', 'assets/fonts/gui.xml');

        this.load.json('levels', 'assets/levels.json');
        this.load.json('types', 'assets/types.json');
    }
 
    create() {
        this.scene.start('TypeScene');
        //this.scene.start('MainScene', {levelID:"001"});
    }
};