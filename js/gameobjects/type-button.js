class TypeButton extends Phaser.GameObjects.Container {
 
    constructor(scene, buttonData, current, total) {
        super(scene);

        this.isPressed = this.isDisabled = this.isLocked = false;

        this.buttonData = buttonData;

        if (this.buttonData['unlock'] != undefined) {
            this.unlockData = this.buttonData['unlock'];
            this.isLocked = true;
        }

        this.background = new Phaser.GameObjects.Sprite(scene, 0, 0, "long_buttons");
        this.background.setOrigin(0);
        this.add(this.background);

       //this.timer_text = this.add.bitmapText(0, 2, "font:gui", "", 20);
        this.label = new Phaser.GameObjects.BitmapText(scene, this.background.width / 2, this.background.height / 2, "font:gui", buttonData['name'], 20);
        this.label.setOrigin(0.5);
        this.label.tint = 0xd4d8e9;
        this.add(this.label);

        let txtProgress = new Phaser.GameObjects.BitmapText(scene, this.background.width / 2, (this.background.height / 2) + 20, "font:gui", current + " / " + total, 20);
        txtProgress.setOrigin(0.5);
        txtProgress.tint = 0xd4d8e9;
        this.add(txtProgress);

        if (this.isLocked) {
            let padlock = this.scene.add.image(0, 0, "padlock").setOrigin(0.5);
            padlock.x = (this.background.width) / 2;
            padlock.y = (this.background.height) / 2;
            this.add(padlock);
        }


        this.background.setInteractive();
        this.background.on("pointerdown", () => this.onPointerDown());
        this.background.on("pointerup", () => this.onPointerUp());
        this.background.on("pointerout", () => this.onPointerOut());

        this.button_type = "type";
    }

    disable() {
        this.isDisabled = true;
        //this.background.setFrame(1);
        this.alpha = 0.8;
        this.label.tint = 0x727685;
    	this.background.disableInteractive();
    }

    getType() {
        return this.button_type;
    }

    /* Events */

    onPointerUp() {
    	if (this.isPressed) {
    		this.scene.events.emit("ButtonClicked", this);
    	}
    	this.onPointerOut();
    }

    onPointerDown() {
    	this.isPressed = true;
    	this.background.setFrame(2);
    }

    onPointerOut() {
    	this.isPressed = false;
        if (!this.isDisabled) {
            this.background.setFrame(0);
        }
    }
};