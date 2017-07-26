var words = ["luke", "leia", "chewbacca", "anakin", "darth vader"];
var usedCharacters = [];
var whiteSpace = "&nbsp";
var playing = false;
var wordDict = [];
var correctCounter = 0;
var whiteSpaceRegex = /\s/;
var numberOfGuesses = 10;
var numberOfGuessesRemaining = numberOfGuesses;
var timerTimer;
var timerDiv = document.getElementById("timer");
var timerWrapper = document.getElementById("timerWrapper");
var rateOfChange = 0.05;
var currentRateOfChange = rateOfChange;
var penalty = 0.005;
var myPercentage = 100;

function decide(event){
	if(playing){
		//deprecated?
		//var x = event.which || event.keyCode;
    //var chosenChar = String.fromCharCode(x);
    //$("#myImage").stop(false,true);
    findChars(event.key);
	} else {
		showGameTime();
		playing = true;
		deleteWord();
		startOver(getWord());
	}
}

function printFailureMessage(){

}

function printVictoryMessage(){

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
	coolChar.key = key.toLowerCase();
	coolChar.value = value;
	return coolChar;
}

function getWord(){
	var word = words[Math.floor(Math.random() * words.length)];
	return word;
}

function createEmptySpace(){
	var myChar = document.createElement("div");
	myChar.className = "myChar";
	myChar.innerHTML = whiteSpace;

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
	numberOfGuessesRemaining = numberOfGuesses;
	usedCharacters = [];
	playing = false;
}

function executeLoseState(){
	console.log("you lost");
	printFailureMessage();
}

function executeWinState(){
	console.log("you won");
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
	var myChar = myChar.toUpperCase();
	for(i = 0; i < wordDict.length; i++){
		if(myChar === wordDict[i].key.toUpperCase()){
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
	//$("#myImage").stop(true,false);
	$( "#myImage" ).fadeTo( "fast" , 0, function() {
    // Animation complete.
  });
	console.log("house cleaning");
	printRemainingGuesses();
	printUsedCharacters();
	resetTimer();
	startTimer();
}

function instantiateWord(myWord){
	printRemainingGuesses(numberOfGuesses);
	for(i = 0; i < myWord.length; i++){
		if(myWord.charAt(i).search(whiteSpaceRegex) == -1){
			var myCharElement = createChar(whiteSpace);
			var myElement = createCharContainer(myCharElement);
			var myCharObj = createCharObj(myWord.charAt(i), myCharElement);
			wordDict.push(myCharObj);
			document.getElementById("wordContainer").appendChild(myElement);
		} else {
			console.log("empty space");
			var emptySpace = createEmptySpace();
			document.getElementById("wordContainer").appendChild(emptySpace);
		}
	}
}

function startOver(myWord){
	instantiateWord(myWord);
	houseCleaning();
}

document.addEventListener("keypress", decide);