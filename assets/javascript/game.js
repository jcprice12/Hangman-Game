var words = ["luke", "leia", "chewbacca", "anakin", "darth vader"];
var usedCharacters = [];
var whiteSpace = "&nbsp";
var playing = false;
var wordDict = [];
var correctCounter = 0;
var whiteSpaceRegex = /\s/;

function decide(event){
	if(playing){
		//var x = event.which || event.keyCode;
    //var chosenChar = String.fromCharCode(x);
    findChars(event.key);
	} else {
		playing = true;
		deleteWord();
		instantiateWord(getWord());
	}
}

function printUsedCharacters(){
	console.log("printing");
	var myContainer = document.getElementById("usedCharsContainer");
	console.log(myContainer);
	var myStringOfChars = "";
	for(i = 0; i < usedCharacters.length; i++){
		myStringOfChars = myStringOfChars + usedCharacters[i];
		if(i === (usedCharacters.length - 1)){
			break;
		}
		myStringOfChars = myStringOfChars + ", ";
	}
	console.log(myStringOfChars);
	myContainer.innerHTML = myStringOfChars;
	console.log(myContainer);
}

function createCharObj(key, value){
	var coolChar = new Object();
	coolChar.key = key;
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

function executeWinState(){
	correctCounter = 0;
	playing = false;
}

function findChars(myChar){
	var charIsPresent = false;
	for(i = 0; i < wordDict.length; i++){
		if((myChar === wordDict[i].key) && (myChar != wordDict[i].value.innerHTML)){
			wordDict[i].value.innerHTML = myChar;
			correctCounter++;
			charIsPresent = true;
			if(correctCounter == wordDict.length){
				executeWinState();
			}
		}
	}

	console.log("char chosen is: " + myChar);
	console.log(charIsPresent);
	if(!charIsPresent){
		var upperChar = myChar.toUpperCase();
		if(usedCharacters.indexOf(upperChar) === -1){
			usedCharacters.push(upperChar);
			console.log(usedCharacters);
			printUsedCharacters();
		}
	}
}

function instantiateWord(myWord){
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

document.addEventListener("keypress", decide);