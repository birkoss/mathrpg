class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, levelData) {
        super(scene, 0, 0, "units");

        this.setScale(3);
        this.setOrigin(0);

        this.health = this.max_health = levelData['enemy']['health'];

        scene.anims.create({
            key: "idle_" + levelData['enemy']['frames'][0],
            frames: [{
                frame: levelData['enemy']['frames'][0],
                key: "units"
            },{
                frame: levelData['enemy']['frames'][1],
                key: "units"
            }],
            frameRate: 2,
            yoyo: true,
            repeat: -1
        });

        this.anims.play("idle_" + levelData['enemy']['frames'][0]);
    }

    takeDamage(amount) {
        this.health = Math.max(this.health - amount, 0);

        if (this.health <= 0) {
            this.anims.stop();
            this.setTexture("world");
            this.setScale(1.5);
            this.setFrame(37);
        }
    }

    isAlive() {
        return this.health > 0;
    }
}