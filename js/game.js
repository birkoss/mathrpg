var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    scene: [
        BootScene,
        LevelScene,
        MainScene,
    ]
};

var game = new Phaser.Game(config);

game.load = function() {
	let savegame = {
		levels: {}
	};


	let levels = JSON.parse(localStorage.getItem('levels'));
	if (levels != null) {
		savegame.levels = levels;
	}

	return savegame;
}

game.save = function(name, value) {
	localStorage.setItem(name, JSON.stringify(value));
}