/****************************************************************
	FILE VARIABLES
****************************************************************/
var myHangmanGame;
var startFirstTime = true;
var SOME_WORDS = ["luke skywalker", "leia organa", "chewbacca", "anakin skywalker", "darth vader", "han solo", "C-3PO", "obi-wan kenobi", "R2-D2"];
var GOOD_CHAR_REGEX = /^[A-Z0-9]$/;

//userOptionsObj
var userOptionsObj = {
  E: {
    description: "Easy",
    execute: function(myHangmanGame){
      myHangmanGame = new Hangman(SOME_WORDS,15,0.05,0.005,false);
      return myHangmanGame;
    }
  },
  M: {
    description: "Medium",
    execute: function(myHangmanGame){
      myHangmanGame = new Hangman(SOME_WORDS,12,0.06,0.006,false);
      return myHangmanGame;
    }
  },
  H: {
    description: "Hard",
    execute: function(myHangmanGame){
      myHangmanGame = new Hangman(SOME_WORDS,10,0.07,0.007,false);
      return myHangmanGame;
    }
  }
};

//Hangman Prototype
function Hangman(myWordsArray, myNumberOfGuesses, myRateOfChange, myPenalty, playing){
	/****************************************************************
		Instance CONSTANTS
	****************************************************************/
	var MY_WORDS = myWordsArray;
	var NUMBER_OF_GUESSES = myNumberOfGuesses;
	var PENALTY = myPenalty;
	var SPACE_REGEX = /\s|-/;
	var WHITESPACE = "&nbsp";
	var RATE_OF_CHANGE = myRateOfChange;
	/****************************************************************
		VARIABLES
	****************************************************************/
	var usedCharacters = [];
	var whiteSpace = "&nbsp";
	this.playing = playing;
	var wordDict = [];
	var correctCounter = 0;
	var numberOfGuessesRemaining = NUMBER_OF_GUESSES;
	var timerTimer;
	var timerDiv = document.getElementById("timer");
	var timerWrapper = document.getElementById("timerWrapper");
	var currentRateOfChange = RATE_OF_CHANGE;
	var myPercentage = 100;

	/****************************************************************
	FUNCTIONS THAT CHANGE THE DOM
	****************************************************************/

	//prints the word given to it. When I say "print" I mean it only prints
	//the underscores for the letters in the word. The necessary word information
	//(letters in the word) is saved in the wordDict object.
	this.instantiateWord = function(myWord){
		this.deleteWord();
		for(i = 0; i < myWord.length; i++){
			var myChar = myWord.charAt(i);
			if(myChar.search(SPACE_REGEX) == -1){
				var myCharElement = this.createChar(WHITESPACE);
				var myElement = this.createCharContainer(myCharElement);
				var myCharObj = this.createCharObj(myChar, myCharElement);
				wordDict.push(myCharObj);
				document.getElementById("wordContainer").appendChild(myElement);
			} else {
				var emptySpace;
				if(myChar === "-"){
					emptySpace = this.createEmptySpace(myChar);
				} else {
					emptySpace = this.createEmptySpace(WHITESPACE);
				}
				document.getElementById("wordContainer").appendChild(emptySpace);
			}
		}
	};

	//function that actually prints messages in the messageContainer element
	this.printMessage = function(message){
		document.getElementById("messageContainer").innerHTML = message;
	};

	//print game won message for okayer
	this.printVictoryMessage = function(){
		var myMessage = "You won! Press a key to play again.";
		this.printMessage(myMessage);
	};

	//print a game over message for player
	this.printFailureMessage = function(){
		var myMessage = "Darth Vader has vanquished you. Press a key to play again.";
		this.printMessage(myMessage);
	};

	//prints the amount of incorrect guesses you have left before you lose
	this.printRemainingGuesses = function(){
		var myContainer = document.getElementById("guessesRemainingContainer");
		myContainer.innerHTML = numberOfGuessesRemaining;
	};

	//prints the list of used incorrect characters. loops through array of usedCharacters
	this.printUsedCharacters = function(){
		var myContainer = document.getElementById("usedCharsContainer");
		var myStringOfChars = "";
		for(i = 0; i < usedCharacters.length; i++){
			myStringOfChars = myStringOfChars + usedCharacters[i];
			if(i === (usedCharacters.length - 1)){
				break;
			}
			myStringOfChars = myStringOfChars + ", ";
		}
		myContainer.innerHTML = myStringOfChars;
	};
	//creates DOM for an empty space character (could be a hyphen)
	this.createEmptySpace = function(spaceChar){
		var myChar = document.createElement("div");
		myChar.className = "myChar";
		myChar.innerHTML = spaceChar;
		var myCharContainer = document.createElement("span");
		myCharContainer.className="charContainer";
		myCharContainer.appendChild(myChar);
		return myCharContainer;
	};

	//creates DOM for character on-screen
	this.createChar = function (myCharVal){
		var myChar = document.createElement("div");
		myChar.className = "myChar";
		myChar.innerHTML = myCharVal;
		return myChar;
	};

	//creates DOM for underline below character on screen
	this.createUnderline = function(){
		var myUnderline = document.createElement("div");
		myUnderline.className = "myUnderline";
		return myUnderline;
	};

	//creates DOM for container that holds both underline and character
	this.createCharContainer = function(myCharElement){
		var myCharContainer = document.createElement("span");
		myCharContainer.className="charContainer";
		myCharContainer.appendChild(myCharElement);
		myCharContainer.appendChild(this.createUnderline());
		return myCharContainer;
	};

	//deletes everything in the word container
	this.deleteWord = function(){
		wordDict = [];
		wordContainer = document.getElementById("wordContainer");
		wordContainer.innerHTML = "";
	};

	/****************************************************************
	FUNCTIONS THAT AFFECT THE TIMER
	****************************************************************/
	//stop the timer (on game won or lost)
	this.stopTimer = function(){
		clearTimeout(timerTimer);
	};

	//resets width of timer
	this.resetTimer = function(){
		$(timerDiv).css({'width': '100%'});
	};

	//timer is re-drawn every time this function is called.
	//this function can determine if the game is over
	this.tick = function(){
		//if time is not up
		if(myPercentage !== 0){
			myPercentage = myPercentage - currentRateOfChange;//current rate of change is mutable. size of timer width calculated here
			if(myPercentage <= 0){
				myPercentage = 0;
			}
			var opacityPercentage = (((myPercentage - 100) * -1) / 100)/3;//opacity of darth vader calculated here
			document.getElementById("myImage").style.opacity = opacityPercentage;
			var localPercent = myPercentage + '%';
			$(timerDiv).css({'width': localPercent});
			var that = this;
			timerTimer = setTimeout(function(){
				that.tick();
			}, 10);
		} else { //time is up, round is over
			this.roundOver();
			this.executeLoseState();
		}
	};

	//starts the timer animation
	this.startTimer = function(){
		this.tick();
	};

	/****************************************************************
	GAME LOGIC
	****************************************************************/
	//creates a new instance of a character object to be placed in my dictionary
	//charcters in a dictionary are essentially the characters in the word.
	//the "key" is the corresponding letter in the word. The "value" is the actual DOM object.
	//The value should equal the key for the character to be correct. 
	this.createCharObj = function(key, value){
		var coolChar = new Object();
		coolChar.key = key.toUpperCase();
		coolChar.value = value;
		return coolChar;
	};

	//code to be executed on round over (win or lose)
	this.roundOver = function(){
		myPercentage = 100;
		this.stopTimer();
		currentRateOfChange = RATE_OF_CHANGE;
		correctCounter = 0;
		numberOfGuessesRemaining = NUMBER_OF_GUESSES;
		usedCharacters = [];
		this.playing = false;
	};

	//code to be exectued after a win
	this.executeLoseState = function(){
		this.printFailureMessage();
	};

	//code to be executed after a loss
	this.executeWinState = function(){
		this.printVictoryMessage();
	};

	//code to be executed when a user inputs a NEW worng character. Can determine if game is over
	this.executeWrongGuess = function(upperChar){
		if(usedCharacters.indexOf(upperChar) === -1){
			numberOfGuessesRemaining--;
			currentRateOfChange = currentRateOfChange + PENALTY;
			this.printRemainingGuesses();
			usedCharacters.push(upperChar);
			this.printUsedCharacters();
			if(numberOfGuessesRemaining <= 0){//hopefully it's never less than 0, but this will catch it if it does happen
				this.roundOver();
				this.executeLoseState();
			}
		}
	};

	//gets a random word from the word list array
	this.getWord = function(){
		var word = MY_WORDS[Math.floor(Math.random() * MY_WORDS.length)];
		return word;
	};

	//main bread and butter of the game. searches through chosen word for a matching character. can determine if game is over
	this.findChars = function(myChar){
		var charIsPresent = false;
		//loops through word dictionary (letters in the word) and searches for a matches (finds all matches)
		for(i = 0; i < wordDict.length; i++){
			if(myChar === wordDict[i].key){
				charIsPresent = true;
				if(myChar != wordDict[i].value.innerHTML.toUpperCase()){
					wordDict[i].value.innerHTML = myChar;//set mssing character on screen
					correctCounter++;
					if(correctCounter == wordDict.length){//found all letters
						this.roundOver();
						this.executeWinState();
					}
				}
			}
		};

		//if char was wrong and not seen before
		if(!charIsPresent){
			this.executeWrongGuess(myChar);
		}
	};

	//calls necessary functions to start a new game
	this.startOver = function(){
		var myWord = this.getWord();
		this.instantiateWord(myWord);
		this.houseCleaning();
	};

	/****************************************************************
	HOUSE CLEANING
	****************************************************************/
	//essentially prepares the user for a new game
	this.houseCleaning = function(){
		$( "#myImage" ).fadeTo( "fast" , 0, function() {
	    // Code to be executed only after animation is completed
	  });
		this.printMessage("Press a key to guess a letter.");
		this.printRemainingGuesses();
		this.printUsedCharacters();
		this.resetTimer();
		this.startTimer();
	};
}

/*****************************************************************************************************************
	FUNCTIONS
******************************************************************************************************************/

//displays all elements with the "gametime" class (a little overkill since there's only one element with that class)
var showGameTime = function(){
	var startDivContainer = document.getElementById("startDivContainer");
	startDivContainer.style.display = "none";
	var gameTimeElements = document.getElementsByClassName("gametime");
	for(i = 0; i < gameTimeElements.length; i++){
		gameTimeElements[i].style.display = "block";
	}
}


//decides whether to look for a character on a key press, or start a new game
function decide(event){
	var char = event.key.toUpperCase();
	if(startFirstTime){
		if(userOptionsObj.hasOwnProperty(char)){
			startFirstTime = false;
      myHangmanGame = userOptionsObj[char].execute(myHangmanGame);
      showGameTime();
    }
	} 
	if(myHangmanGame != undefined) {
		if(myHangmanGame.playing === true){
	    if(char.search(GOOD_CHAR_REGEX) !== -1){
	    	myHangmanGame.findChars(char);
	    }
		} else {
			myHangmanGame.playing = true;
			myHangmanGame.startOver();
		}
	}
}


/****************************************************************
EVENT LISTENER / code that is executed
****************************************************************/

//everything pretty much runs once the event listener handles the event
document.addEventListener("keypress", decide);