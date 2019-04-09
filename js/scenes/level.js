class LevelScene extends Phaser.Scene {
    constructor() {
        super({
            key:'LevelScene'
        });
    }
 
    create() {
        let index = 1;
        this.grid = {width: 3, height: 3};
        this.limit = this.grid.width * this.grid.height;

        this.panel_container = this.add.container(0, 0);
        this.levels_container = this.add.container(0, 70);

        this.btn_previous_page = new IconButton(this, "arrow-left", 0, "arrow-left");
        this.btn_previous_page.x = this.btn_previous_page.y = 10;
        this.panel_container.add(this.btn_previous_page);

        this.btn_next_page = new IconButton(this, "arrow-right", 0, "arrow-right");
        this.btn_next_page.x = this.game.config.width - 10 - this.btn_next_page.getBounds().width;
        this.btn_next_page.y = 10;
        this.panel_container.add(this.btn_next_page);

        this.page = 0;
        this.createSelectors();
    }

    createSelectors() {
        /* Disable navigation button depending on the current page */
        if (this.page <= this.minPages()) {
            this.btn_previous_page.disable();
        } else {
            this.btn_previous_page.enable();
        }

        if (this.page >= this.maxPages()) {
            this.btn_next_page.disable();
        } else {
            this.btn_next_page.enable();
        }

        let savegame = this.game.load();

        let index = (this.page*this.limit);

        let spacing = (this.game.config.width - (this.grid.width*100)) / (this.grid.width + 1);

        this.levels_container.removeAll(true);
        for (let y=0; y<this.grid.height; y++) {
            for (let x=0; x<this.grid.width; x++) {
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

        for (let i=0; i<this.levels_container.count(); i++) {
            if (this.levels_container.getAt(i) != null) {
                this.tweens.add({
                    targets: this.levels_container.getAt(i),
                    y: this.levels_container.getAt(i).destination_y,
                    ease: 'Cubic',
                    duration: 300,
                    delay: i * 50,
                    onComplete: this.onLevelSelectorVisible,
                    onCompleteScope: this
                });
            }
        }
    }

    minPages() {
        return 0;
    }

    maxPages() {
        return Math.floor(this.cache.json.get("levels").length / this.limit);
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
        if (!button.isLocked) {
            this.hideSelectors(button, this.onSelectorMoved);
        } else {
            this.scene.pause();

            let popup_type = "level_locked";
            let popup = new PopupScene(popup_type, {unlockData:button.unlockData});
            this.scene.add("popup_" + popup_type, popup, true);
            popup.events.off("ButtonPopupClicked").on("ButtonPopupClicked", this.onPopupButtonClicked, this);
        }
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
            this.page = Math.min(Math.max(this.minPages(), this.page + direction), this.maxPages());
            this.createSelectors();
        }
    }

    onButtonClicked(button) {
        switch (button.getType()) {
            case "arrow-left":
                if (this.page > this.minPages()) {
                    this.hideSelectors(-1, this.onArrowClicked);
                }
                break;
            case "arrow-right":
                if (this.page < this.maxPages()) {
                    this.hideSelectors(1, this.onArrowClicked);
                }
                break;
        }
    }

    onPopupButtonClicked(popup_type, button_text) {
        switch (popup_type) {
            case "level_locked":
                this.scene.resume();
                break;
        }
    }
};