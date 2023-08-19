// var currentLevel = 0;
//
// window.onload = function() {
//     document.getElementById('level_indicator').innerText = currentLevel+"";
// }

var game = new Vue({
    el: "#div_container",
    data: {
        // the current level, 0 means the game haven't started yet
        currentLevel : 0,
        // -1 means the player have failed this round, 0 means the game is in progress, 1 means the player have seccessfully passed this round
        gameStatus : 0,
        // button sequence that the game randomly generated
        buttonSequence: [],
        // the sequence that play had clicked
        clickSequence : [],
        // whether it's the player's turn to click
        playerRound : false,
        // whether each button is active (light up)
        activeButton1 : false,
        activeButton2 : false,
        activeButton3 : false,
        activeButton4 : false,
    },
    methods: {
        // returns the current level or "start" if the player haven't started the game
        showLevel: function() {
            if (this.currentLevel == 0) {
                return "start";
            }
            if (this.gameStatus == -1) {
                return "✗";
            }
            if (this.gameStatus == 1) {
                return "✓";
            }
            return this.currentLevel;
        },

        // handles a click event on the center button
        centerButtonClick: function() {
            // if the game is waiting to be started, then start the game
            if (this.currentLevel == 0) {
                this.currentLevel++;
                this.generateSequence();
                // this.playerRound = true;
            }
        },

        // generates a sequence for this round of the game
        generateSequence: function () {
            // if currentLevel <= 0, meaning the game haven't started, then the program won't enter this for loop
            if (this.buttonSequence.length < this.currentLevel) {
                this.gameStatus = 0;
                let buttonId = Math.floor(Math.random() * 4 + 1);
                this.buttonSequence.push(buttonId);
                // light up the randomly chosen button for 1 second
                this.lightUpButton(buttonId);
                setTimeout(this.deactivateAllButtons, 800);
                // wait another second before choosing the next button
                if (this.buttonSequence.length != this.currentLevel) {
                    setTimeout(this.generateSequence, 1100);
                } else {
                    // only when the sequence have finished generating and lighting up, then it's player's turn to click
                    this.playerRound = true;
                }
            }

            console.log("generateSequence(): " + this.buttonSequence);

        },

        // light up the buttons according to the generated sequence
        lightUpButton: function(buttonId) {
            switch(buttonId) {
                case 1:
                    this.activeButton1 = true;
                    break;
                case 2:
                    this.activeButton2 = true;
                    break;
                case 3:
                    this.activeButton3 = true;
                    break;
                case 4:
                    this.activeButton4 = true;
                    break;
                default:
                    break;
            }
        },

        // deactivate all the buttons
        deactivateAllButtons: function() {
            this.activeButton1 = false;
            this.activeButton2 = false;
            this.activeButton3 = false;
            this.activeButton4 = false;
        },

        // handles a mouse down event on a color button
        buttonOnMouseDown: function(buttonId) {
            if (this.playerRound) {
                this.lightUpButton(buttonId);
                this.clickSequence.push(buttonId);
                console.log("click: " + buttonId);
            }
        },

        // handles a mouse up event on the buttons
        buttonOnMouseUp: function() {
            if (this.playerRound) {
                this.deactivateAllButtons();
                // if the sequence that the player have clicked doesn't align with the generated sequence
                // then repeat this round again
                if ( !this.checkSequence() ) {
                    console.log("sequence not match");
                    this.gameStatus = -1;
                    this.resetForNextRound();
                    setTimeout(this.generateSequence, 1000);
                    // this.generateSequence();
                }
                else if (this.clickSequence.length == this.buttonSequence.length) {
                    this.gameStatus = 1;
                    this.resetForNextRound()
                    this.currentLevel++;
                    setTimeout(this.generateSequence, 1000);
                    // this.generateSequence();
                }
            }
        },

        // resets fields for preparing the next round
        resetForNextRound: function() {
            this.playerRound = false;
            this.buttonSequence = [];
            this.clickSequence = [];
        },

        // checks the the sequence that the player have clicked with the generated sequence
        checkSequence: function() {
            for (let i = 0; i < this.clickSequence.length; i++) {
                if (this.clickSequence[i] != this.buttonSequence[i]) {
                    return false;
                }
            }
            return true;
        },

        // restart the game
        restart: function() {
            this.currentLevel = 1;
            this.gameStatus = 0;
            this.resetForNextRound();
            this.deactivateAllButtons();
            this.generateSequence();
        }
    }
})