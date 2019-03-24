class HealthBar extends Phaser.GameObjects.Container {
    constructor(scene, width, height, backgroundColor, rangeColor) {
        super(scene);

        let background = scene.add.graphics();
        background.fillStyle(backgroundColor, 1);
        background.fillRect(0, 0, width, height);
        this.add(background);

        this.range = scene.add.graphics();
        this.range.fillStyle(rangeColor, 1);
        this.range.fillRect(0, 0, width, height);
        this.add(this.range);

        this.max_width = width;
    

    }

    set(amount) {
        console.log(amount, this.max_width);
        this.range.scaleX = amount;
    }
};