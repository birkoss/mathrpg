class PopupScene extends Phaser.Scene {
    constructor(type, config) {
        super({key:'PopupScene'});

        console.log("CONSTRUCTOR");

        this.popup_type = type;
        this.config = config;
    }
 
    create() {
        console.log("CREATE");
       this.background = this.add.graphics();

       this.background.fillStyle(0x000000, 1);
       this.background.fillRect(0, 0, this.game.config.width, this.game.config.height);

       this.popup_container = this.add.container();
       this.createPopup("Es-tu sur ?");

       this.events.off("ButtonClicked").on("ButtonClicked", this.onButtonClicked, this);
    }

    init() {
        console.log("INIT");
    }

    createPopup(text) {

        let background = this.add.image(0, 0, "popup:background").setOrigin(0);
        this.popup_container.add(background);

        let inside_background_sprite = "inside_small";

        switch (this.getType()) {
            case "level_locked":
                inside_background_sprite = "inside_large";
                break;
            case "gameover":
                inside_background_sprite = "inside_medium";
                break;
            case "leave":
                inside_background_sprite = "inside_medium";
                break;
        }

        let inside = this.add.image(0, 0, "popup:" + inside_background_sprite).setOrigin(0);
        inside.x = (background.width - inside.width) / 2;
        inside.y = inside.x;
        this.popup_container.add(inside);


        this.message = this.add.bitmapText(0, 0, "font:gui", text, 20, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setOrigin(0);
        this.message.x = (background.width - this.message.getTextBounds().local.width) / 2;
        this.message.tint = 0x575246;
        this.message.y = 34;

        console.log(background.width, this.message.width, this.message.getTextBounds());

        this.popup_container.add(this.message);

        this.buttons = this.add.group();
        let button;

        switch (this.getType()) {
            case "leave":
                this.message.text = "Es-tu sur de\nvouloir quitter\ncette partie?";
                this.message.y = 50;

                button = new CustomButton(this, "Oui", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 26;
                this.buttons.add(button);
                this.popup_container.add(button);

                button = new CustomButton(this, "Non", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 94;
                this.buttons.add(button);
                this.popup_container.add(button);
                break;
            case "gameover":
                this.message.text = "Tu es mort !\n\nEssaie d'être\nplus rapide la\nprochaine fois.";
                this.message.y = 30;
                button = new CustomButton(this, "Ok", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 50;
                this.buttons.add(button);
                this.popup_container.add(button);
                break;
            case "win":
                this.message.text = "Bravo !\nTu as gagné !";
                button = new CustomButton(this, "Ok", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 100;
                this.buttons.add(button);
                this.popup_container.add(button);

                for (let i=0; i<3; i++) {
                    let star_shadow =  this.add.image((i * 80) + 50, 140 + (i == 1 ? -20 : 0), "star_large");
                    star_shadow.x += (star_shadow.width/2);
                    star_shadow.y += (star_shadow.height/2);
                    star_shadow.tint = 0x000000;
                    this.popup_container.add(star_shadow);

                    if (this.config != undefined && this.config.stars != undefined && this.config.stars > i) {
                        let star =  this.add.image((i * 80) + 50, 140 + (i == 1 ? -20 : 0), "star_large");
                        star.x += (star.width/2);
                        star.y += (star.height/2);
                        star.setScale(10, 10);
                        star.alpha = 0;
                        this.popup_container.add(star);

                        this.tweens.add({
                            targets: star,
                            alpha: 1,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 600,
                            ease: 'Cubic',
                            delay: i * 500
                        });
                    }
                }

                break;
            case "level_locked":
                let levelID = "";
                if (this.config.unlockData != undefined) {
                    this.config.unlockData.forEach(single_unlock => {
                        if (single_unlock.type == "beat") {
                            levelID = single_unlock.levelID;
                        }
                    });
                }

                this.message.text = "Ce niveau est\nbarré !\n\nIl faut battre\nle niveau #"+levelID+"\npour pouvoir y\naccéder.";
                button = new CustomButton(this, "Ok", "popup");
                button.x = (background.width - button.getBounds().width) / 2;
                button.y = (this.message.y * 2) + this.message.height + 30;
                this.buttons.add(button);
                this.popup_container.add(button);
                break;
        }

        this.message.x = (background.width - this.message.getTextBounds().local.width) / 2;

        /*
        let graphics = new Phaser.GameObjects.Graphics(this, 0, 0);
        let bounds = this.message.getTextBounds();
        graphics.lineStyle(1, 0x00FF00, 1.0);
        graphics.strokeRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height);
        this.popup_container.add(graphics);
        */

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