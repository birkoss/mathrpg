class IconButton extends Phaser.GameObjects.Container {
 
    constructor(scene, spritesheet, frame, type) {
        super(scene, 100, 100);

        this.isPressed = this.isDisabled = false;

        this.background = new Phaser.GameObjects.Sprite(scene, 0, 0, "small_buttons");
        this.background.setOrigin(0);
        this.add(this.background);

       //this.timer_text = this.add.bitmapText(0, 2, "font:gui", "", 20);
        this.icon = new Phaser.GameObjects.Sprite(scene, this.background.width / 2, this.background.height / 2, spritesheet, frame);
        this.icon.setOrigin(0.5);
        this.icon.origin_y = this.icon.y;
        //this.icon.tint = 0xd4d8e9;
        this.add(this.icon);

        this.background.setInteractive();
        this.background.on("pointerdown", () => this.onPointerDown());
        this.background.on("pointerup", () => this.onPointerUp());
        this.background.on("pointerout", () => this.onPointerOut());

        if (type == undefined) {
            type = "exit";
        }
        this.button_type = type;
    }

    enable() {
        this.isDisabled = false;
        //this.background.setFrame(1);
        this.alpha = 1;
        this.icon.tint = this.icon.original_tint;
        this.background.setInteractive();
    }

    disable() {
        this.isDisabled = true;
        //this.background.setFrame(1);
        this.alpha = 0.8;
        this.icon.original_tint = this.icon.tint;
        this.icon.tint = 0x727685;
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
    	this.background.setFrame(1);
        this.icon.y = this.icon.origin_y + 4;
    }

    onPointerOut() {
        this.icon.y = this.icon.origin_y;
    	this.isPressed = false;
        if (!this.isDisabled) {
            this.background.setFrame(0);
        }
    }
};