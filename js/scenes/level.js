class LevelScene extends Phaser.Scene {
    constructor() {
        super({
            key:'LevelScene'
        });
    }
 
    create() {
        let savegame = this.game.load();

        let index = 1;

        let spacing = (this.game.config.width - 300) / 4;

        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let button = new LevelSelector(this, index++, this.cache.json.get('levels'), savegame);
                button.x = ((100 + spacing) * x) + spacing;
                button.y = ((100 + spacing) * y) + spacing;
                this.add.existing(button);

                let data = savegame.levels[button.levelID];

                if (data == undefined) {
                } else {
                    this.enemy = new Unit(this, this.cache.json.get('levels')[button.levelID]);
                    this.enemy.x = button.x + ((100 - (this.enemy.width * this.enemy.scaleX)) / 2);
                    this.enemy.y = button.y + 4;
                    this.add.existing(this.enemy);
                }


            }
        }

        this.events.off("LevelSelectorClicked").on("LevelSelectorClicked", this.onLevelSelectorClicked, this);
    }

    onLevelSelectorClicked(button) {
        console.log(button, button.levelID);
        this.scene.start('MainScene', {levelID:button.levelID});
    }
};