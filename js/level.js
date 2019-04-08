class Level {
	constructor() {
		this.questions = [];
		this.current_question = 0;
	}

	generate(levelID, levelsData) {
		this.data = levelsData[levelID];

		this.data['questions'].forEach(function(single_block) {
			let current_quantity = 0;
			do {
				let question = {
					first_operand: Phaser.Math.Between(single_block['first_operand_range'][0], single_block['first_operand_range'][1]),
					operator: single_block['operator'],
					second_operand: Phaser.Math.Between(single_block['second_operand_range'][0], single_block['second_operand_range'][1]),
					text: "",
					answer: 0
				};

				switch (question.operator) {
					case "+":
						question.answer = question.first_operand + question.second_operand;
						break;
					case "-":
						/* Swap operands to prevent negative answer */
						if (question.first_operand < question.second_operand) {
							let swap = question.second_operand;
							question.second_operand = question.first_operand;
							question.first_operand = swap;
						}
						question.answer = question.first_operand - question.second_operand;
						break;
				}

				/* Set the question TEXT */
				question.text = question.first_operand + " " + question.operator + " " + question.second_operand;
				
				/* Only add this question if it's unique */
				if ( this.questions.filter(single_question => single_question.text == question.text).length == 0 ) {
					this.questions.push(question);
					current_quantity++;
				}
			} while (current_quantity < single_block['quantity']);
		}, this);
	}

	nextQuestion() {
		return this.questions[this.current_question++];
	}

	isCompleted() {
		return this.current_question >= this.questions.length;
	}

	remainingQuestions() {
		return Math.max(0, this.questions.length - this.current_question);
	}
}