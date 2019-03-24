class LevelSelector extends Phaser.GameObjects.Container {
 
    constructor(scene, levelID) {
        super(scene, 100, 100);

        this.isPressed = this.isDisabled = false;

        this.levelID = levelID;
        if (this.levelID < 10) {
            this.levelID = "00" + this.levelID;
        } else if (this.levelID < 100) {
            this.levelID = "0" + this.levelID;
        }

        this.background = this.scene.add.image(0, 0, "grass").setOrigin(0);
        this.background.setScale(2);

        this.add(this.background);

        this.label = this.scene.add.bitmapText(this.background.x + this.background.width / 2, this.background.y + this.background.height / 2, "font:gui", "?", 20);
        this.label.setOrigin(0.5);
        this.label.tint = 0x000000;

        this.add(this.label);

        for (let i=0; i<3; i++) {
            let star = this.scene.add.image(this.background.x, this.background.y + this.background.height, "star").setOrigin(0);

            star.x += (star.width * i);
            this.add(star);
        }

        this.background.setInteractive();
        this.background.on("pointerup", () => this.onPointerUp());

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
    		this.scene.events.emit("LevelSelectorClicked", this);
    	}
    	this.onPointerOut();
    }

    onPointerDown() {
    	this.isPressed = true;
    	//this.background.setFrame(2);
    }

    onPointerOut() {
    	this.isPressed = false;
        if (!this.isDisabled) {
          //  this.background.setFrame(0);
        }
    }
};