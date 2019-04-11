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

        this.level = new Level();
        this.level.generate(this.config.levelID, this.cache.json.get('levels'));

        this.createEnemy();

        this.timerConfig = { delay: 1000, callback: this.onTimerEvent, callbackScope: this, loop: true, paused: true };
        this.timer = this.time.addEvent(this.timerConfig);

        this.question_container = this.add.container();
        this.createQuestion();

        this.events.off("ButtonClicked").on("ButtonClicked", this.onButtonClicked, this);
    }

    showPopup(popup_type, config) {
        this.scene.pause();

        var popup = new PopupScene(popup_type, config);
        popup.setEvent(this.onPopupButtonClicked, this);

        this.scene.add("popup_" + popup_type, popup, true);
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
            repeat: 2
        });

        this.effects.on("animationcomplete", function(tween, sprite, element) {
            element.destroy();
            this.destroyQuestion();
        }, this);

        this.effects.anims.play("attack", true);
    }

    createEnemy() {
        this.enemy = new Unit(this, this.level.data);
        this.enemy.x = (this.game.config.width - (this.enemy.width * this.enemy.scaleX)) / 2;
        this.enemy.y = 96;
        this.add.existing(this.enemy);

        this.enemy_text = this.add.bitmapText(0, 20 + this.enemy.y + (this.enemy.height * this.enemy.scaleY), "font:gui", this.enemy.health + "/" + this.enemy.max_health, 10);
        this.enemy_text.x = (this.game.config.width - this.enemy_text.width) / 2;

        this.health_bar = new HealthBar(this, 96, 6, 0x700A0A, 0xCD2222);
        this.health_bar.x = (this.game.config.width - 96) / 2;
        this.health_bar.y = this.enemy.y + (this.enemy.height * this.enemy.scaleY) + 10;
        this.add.existing(this.health_bar);

        this.enemy.destination_x = this.enemy.x;
        this.enemy.x = this.game.config.width;
        this.tweens.add({
            targets: this.enemy,
            x: this.enemy.destination_x,
            ease: 'Cubic',
            duration: 300,
            onComplete: this.onEnemyReady,
            onCompleteScope: this
        });

        this.enemy_text.alpha = 0;
        this.health_bar.alpha = 0;
    }

    createPanel() {
        this.panel_container = this.add.container();

        let background = this.add.image(0, 0, "game-panel").setOrigin(0);
        this.panel_container.add(background);

        this.timer_text = this.add.bitmapText(this.panel_container.getBounds().x + 52, this.panel_container.getBounds().height - 52, "font:gui", "", 30, Phaser.GameObjects.BitmapText.ALIGN_RIGHT);
        this.panel_container.add(this.timer_text);

        let icon = this.add.image(this.panel_container.getBounds().x + 30, this.panel_container.getBounds().height - 36, "items", 198);
        this.panel_container.add(icon);

        icon = this.add.image(this.panel_container.getBounds().x + 156, this.panel_container.getBounds().height - 34, "items", 84);
        this.panel_container.add(icon);
        this.live_text = this.add.bitmapText(this.panel_container.getBounds().x + 178, this.panel_container.getBounds().height - 52, "font:gui", "10", 30).setOrigin(0, 0);
        this.panel_container.add(this.live_text);

        let button = new IconButton(this, "items", 10);
        button.x = this.panel_container.getBounds().width - button.getBounds().width - 10;
        button.y = this.panel_container.getBounds().height - button.getBounds().height - 10;
        this.panel_container.add(button);


        this.panel_container.x = (this.game.config.width - background.width) / 2;
        this.panel_container.y = -this.panel_container.getBounds().height + 66;

        this.panel_container.destination_y = this.panel_container.y;
        this.panel_container.y = -this.panel_container.getBounds().height;
        this.tweens.add({
            targets: this.panel_container,
            y: this.panel_container.destination_y,
            ease: 'Cubic',
            duration: 300,
        });
    }

    createQuestion() {
        this.attack_force = 10;
        this.timer_text.setText(this.attack_force);

        this.question_container.removeAll(true);

        let background = this.add.image(0, 0, "question").setOrigin(0);
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

            /* Prevent negative answer, for now */
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
        switch (button.getType()) {
            case "answer":
                if (button.label.text == this.current_question.answer) {
                    if (this.attack_force > 0) {
                        this.attack(this.attack_force);
                    }
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

            /* Hide enemy information when it's dead */
            this.health_bar.alpha = this.enemy_text.alpha = 0;

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
                    - Combo
                        - Maybe add the longest combo to the score
            */

            let stars = 0;

            let max_total = (this.level.questions.length * 10);// - this.enemy.max_health;
            let current_total = (this.level.remainingQuestions() * 10) + this.attack_force;

            if (current_total >= max_total * .75) {
                stars = 3;
            } else if (current_total >= max_total * .50) {
                stars = 2
            } else if (current_total >= max_total * .25) {
                stars = 1
            } 

            savegame.levels[this.config.levelID]['tries']++;
            if (savegame.levels[this.config.levelID]['stars'] < stars) {
                savegame.levels[this.config.levelID]['stars'] = stars;
            }

            this.game.save(savegame);

            this.showPopup("win", {stars: stars});

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

    onEnemyReady() {
        this.tweens.add({
            targets: this.enemy_text,
            alpha: 1,
            ease: 'Cubic',
            duration: 600,
        });
        this.tweens.add({
            targets: this.health_bar,
            alpha: 1,
            ease: 'Cubic',
            duration: 600,
        });
    }
};