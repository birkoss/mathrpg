class PopupScene extends Phaser.Scene {
    constructor(type) {
        super({key:'PopupScene'});

        this.popup_type = type;
    }
 
    create() {
       this.background = this.add.graphics();

       this.background.fillStyle(0x000000, 1);
       this.background.fillRect(0, 0, this.game.config.width, this.game.config.height);


       this.popup_container = this.add.container();
       this.createPopup("Es-tu sur ?");

       this.events.off("ButtonClicked").on("ButtonClicked", this.onButtonClicked, this);
    }

    createPopup(text) {

        let background = this.add.image(0, 0, "panel").setOrigin(0);

        this.popup_container.add(background);

        this.message = this.add.bitmapText(0, 0, "font:gui", text, 20).setOrigin(0);
        this.message.x = (background.width - this.message.width) / 2;
        this.message.tint = 0x575246;
        this.message.y = 34;

        this.popup_container.add(this.message);

        this.buttons = this.add.group();
        let button;

        switch (this.getType()) {
            case "leave":
                button = new CustomButton(this, "Oui", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 50;
                this.buttons.add(button);
                this.popup_container.add(button);

                button = new CustomButton(this, "Non", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 150;
                this.buttons.add(button);
                this.popup_container.add(button);
                break;
            case "gameover":
                this.message.text = "Tu es mort !";
                button = new CustomButton(this, "Ok", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 50;
                this.buttons.add(button);
                this.popup_container.add(button);
                break;
            case "win":
                this.message.text = "Bravo !";
                button = new CustomButton(this, "Ok", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 50;
                this.buttons.add(button);
                this.popup_container.add(button);
                break;
        }

        let destY = this.game.config.height - background.height;

        this.popup_container.x = (this.game.config.width - background.width) / 2;
        this.popup_container.y = this.game.config.height;
        this.background.alpha = 0;

        this.tweens.add({
            targets: this.popup_container,
            y: destY,
            ease: 'Cubic',
            duration: 300,
        });
        this.tweens.add({
            targets: this.background,
            alpha: 0.7,
            ease: 'Cubic',
            duration: 300,
        });
    }

    close() {
        this.tweens.add({
            targets: this.popup_container,
            y: this.game.config.height,
            alpha: 0,
            ease: 'Cubic',
            duration: 300,
            onComplete: this.onPopupClosed,
            onCompleteScope: this
        });

        this.tweens.add({
            targets: this.background,
            alpha: 0,
            ease: 'Cubic',
            duration: 300,
            onComplete: this.onPopupClosed,
            onCompleteScope: this
        });
    }

    getType() {
        return this.popup_type;
    }

    onButtonClicked(button) {
        this.events.emit("ButtonPopupClicked", this.getType(), button.label.text);

        this.close();
    }

    onPopupClosed() {
        let active_tweens = this.tweens.getAllTweens().filter(tween => tween.isPlaying());
        if (active_tweens.length == 1) {
            console.log("REmoving...");
            this.scene.remove();
        }
    }
};