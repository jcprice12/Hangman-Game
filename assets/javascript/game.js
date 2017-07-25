var words = ["luke", "leia", "chewbacca", "anakin"];
var myWordsLength = words.length;
var whiteSpace = "&nbsp";
var playing = false;
var wordDict = [];

function decide(event){
	if(playing){
		var x = event.which || event.keyCode;
    var chosenChar = String.fromCharCode(x);
    findChars(chosenChar);
	} else {
		playing = true;
		console.log("hey");
		instantiateWord(getWord());
	}
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
	console.log(myCharContainer);
	return myCharContainer;
}

function findChars(myChar){
	for(i = 0; i < wordDict.length; i++){
		if(myChar === wordDict[i].key){
			wordDict[i].value.innerHTML = myChar;
		}
	}
}

function instantiateWord(myWord){
	for(i = 0; i < myWord.length; i++){
		var myCharElement = createChar(whiteSpace);
		var myElement = createCharContainer(myCharElement);
		var myCharObj = createCharObj(myWord.charAt(i), myCharElement);
		wordDict.push(myCharObj);
		console.log(myCharObj);
		document.getElementById("wordContainer").appendChild(myElement);
	}
}

document.addEventListener("keypress", decide);