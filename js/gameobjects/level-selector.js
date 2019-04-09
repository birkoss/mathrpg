class LevelSelector extends Phaser.GameObjects.Container {
 
    constructor(scene, levelIndex, levelsData, savegame) {
        super(scene);

        let levelData = levelsData[levelIndex];

        this.isPressed = this.isDisabled = false;

        this.levelID = levelData.id;


        let data = savegame.levels[this.levelID];

        this.background = this.scene.add.image(0, 0, "level-selector").setOrigin(0);

        this.add(this.background);

        if (data == undefined) {
            let label = this.scene.add.bitmapText((this.background.width * this.background.scaleX) / 2, (this.background.height * this.background.scaleY) / 2, "font:gui", parseInt(this.levelID), 30);
            label.setOrigin(0.5);
            label.tint = 0x5d6069;

            this.add(label);
        }

        if (data != undefined) {
            for (let i=0; i<3; i++) {
                let star = this.scene.add.image(this.background.x, this.background.y + this.background.height, "star").setOrigin(0);

                star.x += (30 * i) + 8;
                star.y = ((this.background.height * this.background.scaleY) - star.height) - 4;
                this.add(star);

                if (data.stars < i+1) {
                    star.tint = 0x000000;
                }
            }

            this.enemy = new Unit(this.scene, levelData);
            this.enemy.setOrigin(0);
            this.enemy.x = 0 + ((this.background.width - (this.enemy.width * this.enemy.scaleX)) / 2);
            this.enemy.y = 0 + 4;
            this.scene.sys.updateList.add(this.enemy);
            this.add(this.enemy);
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