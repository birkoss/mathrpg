class LevelScene extends Phaser.Scene {
    constructor() {
        super({
            key:'LevelScene'
        });
    }
 
    create() {
        let savegame = this.game.load();

        let index = 1;

        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let button = new LevelSelector(this, index++);
                button.x = 100 * x;
                button.y = 100 * y;

                this.add.existing(button);
            }
        }

        this.events.off("LevelSelectorClicked").on("LevelSelectorClicked", this.onLevelSelectorClicked, this);
    }

    onLevelSelectorClicked(button) {
        console.log(button, button.levelID);
        this.scene.start('MainScene', {levelID:button.levelID});
    }
};