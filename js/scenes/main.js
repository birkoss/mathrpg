class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });

        this.config = {};
    }

    init(config) {
        this.config = config;
    }
 
    create() {
        this.debug = false;

        this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "grass").setOrigin(0);

        this.createPanel();

        this.question_container = this.add.container(0, 0);

        this.timer_text = this.add.bitmapText(this.panel_container.getBounds().x + 50, 15, "font:gui", "", 30, Phaser.GameObjects.BitmapText.ALIGN_RIGHT);
        this.live_text = this.add.bitmapText(this.panel_container.getBounds().x + 148, 15, "font:gui", "10", 30).setOrigin(0, 0);

        this.level = new Level();
        this.level.generate(this.config.levelID, this.cache.json.get('levels'));

        this.enemy = new Unit(this, this.level.data);
        this.enemy.x = (this.game.config.width - (this.enemy.width * this.enemy.scaleX)) / 2;
        this.enemy.y = 96;
        this.add.existing(this.enemy);

        this.enemy_text = this.add.bitmapText(0, 20 + this.enemy.y + (this.enemy.height * this.enemy.scaleY), "font:gui", this.enemy.health + "/" + this.enemy.max_health, 10);
        this.enemy_text.x = (this.game.config.width - this.enemy_text.width) / 2;

        this.timerConfig = { delay: 1000, callback: this.onTimerEvent, callbackScope: this, loop: true, paused: true };
        this.timer = this.time.addEvent(this.timerConfig);

        this.createQuestion();

        this.health_bar = new HealthBar(this, 96, 6, 0x700A0A, 0xCD2222);
        this.health_bar.x = (this.game.config.width - 96) / 2;
        this.health_bar.y = this.enemy.y + (this.enemy.height * this.enemy.scaleY) + 10;
        this.add.existing(this.health_bar);

        this.events.off("ButtonClicked").on("ButtonClicked", this.onButtonClicked, this);
    }

    showPopup(popup_type) {
        console.log(popup_type);
        this.scene.pause();
        
        var popup = new PopupScene(popup_type);

        this.scene.add("popup_" + popup_type, popup, true);
        popup.events.off("ButtonPopupClicked").on("ButtonPopupClicked", this.onPopupButtonClicked, this);
    }

    attack(attack_force) {
        this.enemy.takeDamage(attack_force);
        this.enemy_text.setText(this.enemy.health + "/" + this.enemy.max_health);

        this.health_bar.set(this.enemy.health / this.enemy.max_health);

        this.effects = this.add.sprite(this.enemy.x + (this.enemy.width * this.enemy.scaleX) / 2, this.enemy.y + (this.enemy.height * this.enemy.scaleY) / 2, "tileset:effectsLarge");
        this.effects.setScale(2);

        this.anims.create({
            key: "attack",
            frames: [{
                frame: 10,
                key: "tileset:effectsLarge"
            },{
                frame: 11,
                key: "tileset:effectsLarge"
            }],
            frameRate: 20,
            yoyo: true,
            repeat: 2,
            onComplete: this.onAttackCompleted,
            onCompleteScope: this
        });

        this.effects.on("animationcomplete", function() {
            this.destroy();
        });

        this.effects.anims.play("attack", true);
    }

    createPanel() {
        this.panel_container = this.add.container();

        let background = this.add.image(0, 0, "game-panel").setOrigin(0);
        this.panel_container.add(background);

        this.buttons = this.add.group();

        this.add.image(38, 30, "items", 198);
        this.add.image(136, 30, "items", 84);

        let button = new IconButton(this, "items", 10);

        button.x = this.panel_container.getBounds().width - button.getBounds().width - 10;
        button.y = this.panel_container.getBounds().height - button.getBounds().height - 10;

       this.panel_container.add(button);

        let destY = this.game.config.height - background.height;

        this.panel_container.x = (this.game.config.width - background.width) / 2;
        this.panel_container.y = -this.panel_container.getBounds().height + 66;

        /*
        this.panel_container.y = this.game.config.height;

        this.tweens.add({
            targets: this.panel_container,
            y: destY,
            ease: 'Cubic',
            duration: 300,
            onComplete: this.onQuestionCreated,
            onCompleteScope: this
        });
        */
    }

    createQuestion() {

        this.damage = 10;

        this.attack_force = 10;
        this.timer_text.setText(this.attack_force);

        //this.timer.reset({paused: false});


        this.question_container.removeAll(true);

        let background = this.add.image(0, 0, "panel").setOrigin(0);

        this.question_container.add(background);

        this.current_question = this.level.nextQuestion();
        this.live_text.text = this.level.remainingQuestions();

        this.question = this.add.bitmapText(0, 0, "font:gui", this.current_question.text + ' =', 20).setOrigin(0);
        this.question.x = (background.width - this.question.width) / 2;
        this.question.tint = 0x575246;
        this.question.y = 34;

        this.question_container.add(this.question);

        let answers = [this.current_question.answer];
        do {
            let modifier = Phaser.Math.Between(1, 5);
            let direction = Phaser.Math.Between(1, 2);

            let new_answer = Math.abs(this.current_question.answer);
            if (direction == 1) {
                new_answer += modifier;
            } else {
                new_answer -= modifier;
            }

            /* Prevent negative answer */
            if (new_answer < 0) {
                new_answer = 0;
            }

            let unique_answer = true;
            answers.forEach(function(single_answer) {
                if (single_answer == new_answer) {
                    unique_answer = false;
                }
            });

            if (unique_answer) {
                answers.push(new_answer);
            }
        } while (answers.length < 4);

        if (!this.debug) {
            Phaser.Utils.Array.Shuffle(answers);
        }

        this.buttons = this.add.group();
        answers.forEach(function(answer, index) {
            let button = new CustomButton(this, answer);

            button.x = (background.width - button.getBounds().width) / 2;
            button.y = (index * (button.getBounds().height + 10)) + (this.question.y * 2) + this.question.height;

            this.buttons.add(button);

           this.question_container.add(button);
        }, this);


        let destY = this.game.config.height - background.height;

        this.question_container.x = (this.game.config.width - background.width) / 2;
        this.question_container.y = this.game.config.height;

        this.tweens.add({
            targets: this.question_container,
            y: destY,
            ease: 'Cubic',
            duration: 300,
            onComplete: this.onQuestionCreated,
            onCompleteScope: this
        });
    }

    destroyQuestion() {
        this.timer.paused = true;

        this.tweens.add({
            targets: this.question_container,
            y: this.game.config.height,
            ease: 'Cubic',
            duration: 300,
            onComplete: this.onQuestionDestroyed,
            onCompleteScope: this
        });
    }

    onButtonClicked(button) {
        console.log("onButtonClicked");
        switch (button.getType()) {
            case "answer":
                if (button.label.text == this.current_question.answer) {
                    if (this.attack_force > 0) {
                        this.attack(this.attack_force);
                    }
                    this.destroyQuestion();
                } else {
                    this.attack_force = Math.max(this.attack_force - 2, 0);
                    button.disable();
                    this.cameras.main.shake(500);
                }
                break;
            case "exit":
                this.showPopup("leave");
                break;
        }
    }

    onPopupButtonClicked(popup_type, button_text) {
        switch (popup_type) {
            case "leave":
                switch (button_text) {
                    case "Oui":
                        this.scene.start('LevelScene');
                        break;
                    case "Non":
                        this.scene.resume();
                        break;
                }
                break;
            case "gameover":
                this.scene.start('LevelScene');
                break;
            case "win":
                this.scene.start('LevelScene');
                break;
        }
    }

    onQuestionDestroyed(tween, targets) {
        if (!this.enemy.isAlive()) {
            let savegame = this.game.load();
            if (savegame.levels[this.config.levelID] == null || savegame.levels[this.config.levelID] == undefined) {
                savegame.levels[this.config.levelID] = {
                    tries: 0,
                    stars: 0
                }
            }

            /*
                @TODO:
                Determine the rating with :
                    - Time remaining
                    - Combo
                    - Set a score on 100.

            */

            savegame.levels[this.config.levelID]['tries']++;
            savegame.levels[this.config.levelID]['stars'] = 1;

            this.game.save(savegame);

            this.showPopup("win");

        } else if (this.level.isCompleted()) {
            this.showPopup("gameover");
        } else {
            this.createQuestion();
        }
    }

    onQuestionCreated(tween, targets) {
        this.timer.reset(this.timerConfig);
        this.timer.paused = false;
    }

    onTimerEvent() {
        this.attack_force = Math.max(this.attack_force - 1, 0);

        this.timer_text.setText(this.attack_force);
        if (this.attack_force <= 0) {
            this.attack_force = 0;
            this.cameras.main.shake(500);
            this.timer.paused = true;

            this.buttons.getChildren().forEach(function(button) {
                if (button.label.text != this.current_question.answer) {
                    button.disable();
                }
            }, this);
        }
    }
};