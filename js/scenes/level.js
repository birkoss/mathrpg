class LevelScene extends Phaser.Scene {
    constructor() {
        super({
            key:'LevelScene'
        });
    }
 
    create() {
        let index = 1;
        this.isAnimating = false;

        this.panel_container = this.add.container(0, 0);
        this.levels_container = this.add.container(0, 70);

        let button = new IconButton(this, "arrow-left", 0, "arrow-left");
        button.x = button.y = 10;
        //button.x = this.levels_container.getBounds().width - button.getBounds().width - 10;
        //button.y = this.levels_container.getBounds().height - button.getBounds().height - 10;
        this.panel_container.add(button);

        button = new IconButton(this, "arrow-right", 0, "arrow-right");
        button.x = this.game.config.width - 10 - button.getBounds().width;
        button.y = 10;
        //button.x = this.levels_container.getBounds().width - button.getBounds().width - 10;
        //button.y = this.levels_container.getBounds().height - button.getBounds().height - 10;
        this.panel_container.add(button);

        this.page = 0;
        this.createSelectors();
    }

    createSelectors() {
        let savegame = this.game.load();

        let index = (this.page*9);

        let spacing = (this.game.config.width - 300) / 4;

        this.levels_container.removeAll(true);

        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                if (index < this.cache.json.get('levels').length) {
                    let selector = new LevelSelector(this, index++, this.cache.json.get('levels'), savegame);
                    selector.x = ((100 + spacing) * x) + spacing;
                    selector.y = ((100 + spacing) * y) + spacing;
                    this.levels_container.add(selector);

                    selector.destination_y = selector.y;

                    selector.y = this.game.config.height;
                }
            }
        }

        index = 0;
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                index = ((y * 3) + x);
                if (this.levels_container.getAt(index) != null) {
                    this.tweens.add({
                        targets: this.levels_container.getAt(index),
                        y: this.levels_container.getAt(index).destination_y,
                        ease: 'Cubic',
                        duration: 300,
                        delay: index * 50,
                        onComplete: this.onLevelSelectorVisible,
                        onCompleteScope: this
                    });
                }
            }
        }
    }

    hideSelectors(params, callback) {
        this.events.off("LevelSelectorClicked");
        this.events.off("ButtonClicked");

        let nbrVisible = this.levels_container.count() - 1;

        for (let i=nbrVisible; i>=0; i--) {
            if (this.levels_container.getAt(i) != null) {
                this.tweens.add({
                    targets: this.levels_container.getAt(i),
                    y: this.game.config.height,
                    ease: 'Cubic',
                    duration: 300,
                    delay: (nbrVisible - i) * 50,
                    onComplete: callback,
                    onCompleteScope: this,
                    onCompleteParams: params
                });
            }
        }
    }

    onLevelSelectorVisible() {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            this.events.on("LevelSelectorClicked", this.onLevelSelectorClicked, this);
            this.events.on("ButtonClicked", this.onButtonClicked, this);
        }
    }

    onLevelSelectorClicked(button) {
        this.hideSelectors(button, this.onSelectorMoved);
    }

    onSelectorMoved(tween, selector, button) {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            this.scene.start('MainScene', {levelID:button.levelID});
        }
    }

    onArrowClicked(tween, selector, direction) {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            this.page = Math.min(Math.max(0, this.page + direction), Math.floor(this.cache.json.get('levels').length / 9));
            this.createSelectors();
        }
    }

    onButtonClicked(button) {
        switch (button.getType()) {
            case "arrow-left":
                if (this.page > 0) {
                    this.hideSelectors(-1, this.onArrowClicked);
                }
                break;
            case "arrow-right":
                if (this.page < Math.floor(this.cache.json.get("levels").length / 9)) {
                    this.hideSelectors(1, this.onArrowClicked);
                }
                break;
        }
    }
};