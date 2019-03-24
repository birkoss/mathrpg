class CustomButton extends Phaser.GameObjects.Container {
 
    constructor(scene, text) {
        super(scene, 100, 100);

        this.isPressed = this.isDisabled = false;

        this.background = new Phaser.GameObjects.Sprite(scene, 0, 0, "long_buttons");
        this.background.setOrigin(0);
        this.add(this.background);

       //this.timer_text = this.add.bitmapText(0, 2, "font:gui", "", 20);
        this.label = new Phaser.GameObjects.BitmapText(scene, this.background.width / 2, this.background.height / 2, "font:gui", text, 20);
        this.label.setOrigin(0.5);
        this.label.tint = 0xd4d8e9;
        this.add(this.label);

        this.background.setInteractive();
        this.background.on("pointerdown", () => this.onPointerDown());
        this.background.on("pointerup", () => this.onPointerUp());
        this.background.on("pointerout", () => this.onPointerOut());
    }

    disable() {
        this.isDisabled = true;
        //this.background.setFrame(1);
        this.alpha = 0.8;
        this.label.tint = 0x727685;
    	this.background.disableInteractive();
    }

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