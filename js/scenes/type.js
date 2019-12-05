class TypeScene extends Phaser.Scene {
    constructor() {
        super({
            key:'TypeScene'
        });
    }
 
    create() {
        this.buttons_container = this.add.container(0, 70);

        this.createSelectors();
    }

    createSelectors() {
   
        let savegame = this.game.load();

        this.cache.json.get("types").forEach(single_type => {
            let current = this.cache.json.get("levels").filter(single_level => (single_level['typeID'] == single_type['id'] && savegame.levels[single_level['id']] != undefined)).length;
            let total = this.cache.json.get("levels").filter(single_level => single_level['typeID'] == single_type['id']).length;
            let button = new TypeButton(this, single_type, current, total);
            button.x = (this.game.config.width - button.getBounds().width) / 2;
            button.y = this.buttons_container.count() * (button.getBounds().height + 10);
            button.destination_y = button.y;
            button.y = this.game.config.height;
            this.buttons_container.add(button);
        }, this);

        for (let i=0; i<this.buttons_container.count(); i++) {
            if (this.buttons_container.getAt(i) != null) {
                this.tweens.add({
                    targets: this.buttons_container.getAt(i),
                    y: this.buttons_container.getAt(i).destination_y,
                    ease: 'Cubic',
                    duration: 300,
                    delay: i * 50,
                    onComplete: this.onButtonsVisible,
                    onCompleteScope: this
                });
            }
        }
    }

    hideButtons(params, callback) {
        this.events.off("ButtonClicked");

        let nbrVisible = this.buttons_container.count() - 1;

        for (let i=nbrVisible; i>=0; i--) {
            if (this.buttons_container.getAt(i) != null) {
                this.tweens.add({
                    targets: this.buttons_container.getAt(i),
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

    onButtonsVisible() {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            this.events.on("ButtonClicked", this.onButtonClicked, this);
        }
    }

    onButtonsHidden(tweens, tween, button) {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            this.scene.start('LevelScene', {typeID:button.typeID});
        }
    }

    onPopupButtonClicked(popup_type, button_text) {
        switch (popup_type) {
            case "type_locked":
                this.scene.resume();
                break;
        }
    }

    onButtonClicked(button) {
        if (!button.isLocked) {
            this.hideButtons(button, this.onButtonsHidden);
        } else {
            this.scene.pause();

            let popup_type = "type_locked";
            let popup = new PopupScene(popup_type, {unlockData:button.unlockData});
            popup.setEvent(this.onPopupButtonClicked, this);
            
            this.scene.add("popup_" + popup_type, popup, true);
        }
    }
};