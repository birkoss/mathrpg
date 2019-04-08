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

        this.levels_container = this.add.container();

        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let selector = new LevelSelector(this, index++, this.cache.json.get('levels'), savegame);
                selector.x = ((100 + spacing) * x) + spacing;
                selector.y = ((100 + spacing) * y) + spacing;
                this.levels_container.add(selector);

                selector.destination_y = selector.y;

                selector.y = this.game.config.height;
            }
        }

        index = 0;
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                index = (y * 3) + x;
                this.tweens.add({
                    targets: this.levels_container.getAt(index),
                    y: this.levels_container.getAt(index).destination_y,
                    ease: 'Cubic',
                    duration: 300,
                    delay: index * 50,
                });
            }
        }

        this.events.off("LevelSelectorClicked").on("LevelSelectorClicked", this.onLevelSelectorClicked, this);
    }

    hideSelectors(button) {
        let index = 0;
        for (let y=2; y>=0; y--) {
            for (let x=2; x>=0; x--) {
                index = (y * 3) + x;
                this.tweens.add({
                    targets: this.levels_container.getAt(index),
                    y: this.game.config.height,
                    ease: 'Cubic',
                    duration: 300,
                    delay: (8 - index) * 50,
                    onComplete: this.onSelectorMoved,
                    onCompleteScope: this,
                    onCompleteParams: button
                });
            }
        }
    }

    onLevelSelectorClicked(button) {
        console.log("CLICKED ON", button.levelID);
        this.hideSelectors(button);
    }

    onSelectorMoved(tween, selector, button) {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            this.scene.start('MainScene', {levelID:button.levelID});
        }
    }
};