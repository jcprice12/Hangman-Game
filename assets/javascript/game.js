var NUMBER_OF_GUESSES = 10;
var SPACE_REGEX = /\s|-/;
var GOOD_CHAR_REGEX = /^[A-Z0-9]$/;
var WHITESPACE = "&nbsp";

var words = ["luke skywalker", "leia organa", "chewbacca", "anakin skywalker", "darth vader", "han solo", "C-3PO", "obi-wan kenobi", "R2-D2"];
var usedCharacters = [];
var whiteSpace = "&nbsp";
var playing = false;
var wordDict = [];
var correctCounter = 0;
var numberOfGuessesRemaining = NUMBER_OF_GUESSES;
var timerTimer;
var timerDiv = document.getElementById("timer");
var timerWrapper = document.getElementById("timerWrapper");
var rateOfChange = 0.05;
var currentRateOfChange = rateOfChange;
var penalty = 0.005;
var myPercentage = 100;

function decide(event){
	if(playing){
    var char = event.key.toUpperCase();
    if(char.search(GOOD_CHAR_REGEX) !== -1){
    	findChars(char);
    }
	} else {
		showGameTime();
		playing = true;
		deleteWord();
		startOver(getWord());
	}
}

function printMessage(message){
	document.getElementById("messageContainer").innerHTML = message;
}

function printVictoryMessage(){
	var myMessage = "You won! Press a key to play again.";
	printMessage(myMessage);
}

function printFailureMessage(){
	var myMessage = "Darth Vader has vanquished you. Press a key to play again.";
	printMessage(myMessage);
}

function printRemainingGuesses(){
	var myContainer = document.getElementById("guessesRemainingContainer");
	myContainer.innerHTML = numberOfGuessesRemaining;
}

function printUsedCharacters(){
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
}

function createCharObj(key, value){
	var coolChar = new Object();
	coolChar.key = key.toUpperCase();
	coolChar.value = value;
	return coolChar;
}

function getWord(){
	var word = words[Math.floor(Math.random() * words.length)];
	return word;
}

function createEmptySpace(spaceChar){
	var myChar = document.createElement("div");
	myChar.className = "myChar";
	myChar.innerHTML = spaceChar;
	var myCharContainer = document.createElement("span");
	myCharContainer.className="charContainer";
	myCharContainer.appendChild(myChar);
	return myCharContainer;
}

function createChar(myCharVal){
	var myChar = document.createElement("div");
	myChar.className = "myChar";
	myChar.innerHTML = myCharVal;
	return myChar;
}

function createUnderline(){
	var myUnderline = document.createElement("div");
	myUnderline.className = "myUnderline";
	return myUnderline;
}

function createCharContainer(myCharElement){
	var myCharContainer = document.createElement("span");
	myCharContainer.className="charContainer";
	myCharContainer.appendChild(myCharElement);
	myCharContainer.appendChild(createUnderline());
	return myCharContainer;
}

function deleteWord(){
	wordDict = [];
	wordContainer = document.getElementById("wordContainer");
	wordContainer.innerHTML = "";
}

function roundOver(){
	myPercentage = 100;
	stopTimer();
	currentRateOfChange = rateOfChange;
	correctCounter = 0;
	numberOfGuessesRemaining = NUMBER_OF_GUESSES;
	usedCharacters = [];
	playing = false;
}

function executeLoseState(){
	printFailureMessage();
}

function executeWinState(){
	printVictoryMessage();
}

function executeWrongGuess(upperChar){
	if(usedCharacters.indexOf(upperChar) === -1){
		numberOfGuessesRemaining--;
		currentRateOfChange = currentRateOfChange + penalty;
		printRemainingGuesses();
		usedCharacters.push(upperChar);
		printUsedCharacters();
		if(numberOfGuessesRemaining <= 0){//hopefully it's never less than 0, but this will catch it if it does happen
			roundOver();
			executeLoseState();
		}
	}
}

function findChars(myChar){
	var charIsPresent = false;
	for(i = 0; i < wordDict.length; i++){
		if(myChar === wordDict[i].key){
			charIsPresent = true;
			if(myChar != wordDict[i].value.innerHTML.toUpperCase()){
				wordDict[i].value.innerHTML = myChar;
				correctCounter++;
				if(correctCounter == wordDict.length){
					roundOver();
					executeWinState();
				}
			}
		}
	}

	if(!charIsPresent){
		executeWrongGuess(myChar);
	}
}

function showGameTime(){
	var startDivContainer = document.getElementById("startDivContainer");
	startDivContainer.style.display = "none";
	var gameTimeElements = document.getElementsByClassName("gametime");
	for(i = 0; i < gameTimeElements.length; i++){
		gameTimeElements[i].style.display = "block";
	}
}

function stopTimer(){
	clearTimeout(timerTimer);
}

function resetTimer(){
	$(timerDiv).css({'width': '100%'});
}

function tick(){
	if(myPercentage !== 0){
		myPercentage = myPercentage - currentRateOfChange;
		if(myPercentage <= 0){
			myPercentage = 0;
		}
		var opacityPercentage = (((myPercentage - 100) * -1) / 100)/3;
		document.getElementById("myImage").style.opacity = opacityPercentage;
		var localPercent = myPercentage + '%';
		$(timerDiv).css({'width': localPercent});
		timerTimer = setTimeout(function(){ 
			tick();
		}, 10);
	} else {
		roundOver();
		executeLoseState();
	}
}

function startTimer(){
	tick();
}

function houseCleaning(){
	console.log("house cleaning");
	$( "#myImage" ).fadeTo( "fast" , 0, function() {
    // Code to be executed only after animation is completed
  });
  printRemainingGuesses(NUMBER_OF_GUESSES);
	printMessage("Press a key to guess a letter.");
	printRemainingGuesses();
	printUsedCharacters();
	resetTimer();
	startTimer();
}

function instantiateWord(myWord){
	for(i = 0; i < myWord.length; i++){
		var myChar = myWord.charAt(i);
		if(myChar.search(SPACE_REGEX) == -1){
			var myCharElement = createChar(WHITESPACE);
			var myElement = createCharContainer(myCharElement);
			var myCharObj = createCharObj(myChar, myCharElement);
			wordDict.push(myCharObj);
			document.getElementById("wordContainer").appendChild(myElement);
		} else {
			var emptySpace;
			if(myChar === "-"){
				emptySpace = createEmptySpace(myChar);
			} else {
				emptySpace = createEmptySpace(WHITESPACE);
			}
			document.getElementById("wordContainer").appendChild(emptySpace);
		}
	}
}

function startOver(myWord){
	instantiateWord(myWord);
	houseCleaning();
}

document.addEventListener("keypress", decide);