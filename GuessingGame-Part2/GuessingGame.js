function generateWinningNumber () {
    return Math.ceil(Math.random() * 100);
}

function shuffle (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        let randIndex = Math.ceil(Math.random() * i);

        let t = arr[i];
        arr[i] = arr[randIndex];
        arr[randIndex] = t;
    }
    return arr;
}

function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function () {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function (currGuess) {
    if (currGuess < 1 || currGuess > 100 || typeof currGuess !== 'number') {
        throw "That is an invalid guess.";
    }
    this.playersGuess = currGuess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function (currGuess) {
    if (this.playersGuess === this.winningNumber) { return "You Win!"; }
    else if (this.pastGuesses.includes(this.playersGuess)) { return "You have already guessed that number."; }
    else { this.pastGuesses.push(this.playersGuess); }

    if (this.pastGuesses.length >= 5) { return "You Lose."; }

    let diff = this.difference();
    if (diff < 10) { return "You're burning up!"; }
    else if (diff < 25) { return "You're lukewarm."; }
    else if (diff < 50) { return "You're a bit chilly."; }
    else { return "You're ice cold!"; }
}

Game.prototype.provideHint = function() {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}

function newGame () {
    return new Game();
}

// jQuery --------

$(document).ready(function() {
    let game = new Game();
    $('#submit').click(function() {
        getInput(game);
    });
    $('#player-input').keypress(function(event) {
        if (event.keyCode === 13) getInput(game);
    });
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Guessing Game');
        $('#subtitle').text('Guess a number between 1-100')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
    });
    $('#hint').click(function() {
        $('#title').text('The winning number is one of these... '+game.provideHint());
    });
});

function getInput(game) {
    console.log(game.pastGuesses);
    let playerGuess = $('#player-input').val();
    $('#player-input').val('');
    let output = game.playersGuessSubmission(parseInt(playerGuess, 10));

    if (output === "You have already guessed that number.") {
        $('#title').text(output);
    } else {
        if (output === "You Win!" || output === "You Lose.") {
            $('#title').text(output);
            $('#subtitle').text('click reset to play again.');
            $('#submit, #hint').prop('disabled', true);
        }
        $('#guess-list li:nth-child('+ (game.pastGuesses.length) +')').text(playerGuess);
    }
}
