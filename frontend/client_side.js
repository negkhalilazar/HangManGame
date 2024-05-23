//EECS1012 Term Project
//Negar Khalilazar, student ID#221037437
//client_side.js: Client Side Code
var url = "http://localhost:3000/post";
var myID;
var guessWord;
var wordHint;

function resetGame(){
    var myName = prompt("What is your name?")
    document.getElementById("mistakes").innerHTML = "Wrong Letters: "
    $.post(url+'?data='+JSON.stringify({
                            'name':myName,
                            'action':'generateWord'}),
           response);
}

function printGuess() {
    var guessArea = document.getElementById("guessarea");
    guessArea.innerHTML = "";
    for (var i = 0; i < guessWord.length; i++) {
        guessArea.innerHTML += guessWord[i] + " ";
    }
}

function makeGuess(){
    $.post(
        url+'?data='+JSON.stringify({
        'name':myID, 
        'action':'evaluate', 
        'letterGuess':document.hangman.elements["guess"].value,
        'guessWord':guessWord
        }),
        response
    );
        
}

function requestHint() {
    $.post(
        url + '?data=' + JSON.stringify({
        'name': myID,
        'action': 'hint',
        'wordHint': wordHint
        }),
        response
    );
}

function response(data, status) {
    var response = JSON.parse(data);
    if (response['action'] == 'generateWord') {
        myID = response['nameID'];
        var wordLen = response['len'];
        guessWord = new Array(wordLen);
        for (var i = 0; i < wordLen; i++) {
            guessWord[i] = "_";
        }
        printGuess();
    } else if (response['action'] == 'evaluate') {
        var correct = response['correct'];
        var error_count = response['num_errors'];
        guessWord = response['attemptWord'];
        printGuess();
        if (!correct) {
            var guessedLetter = document.hangman.elements["guess"].value;
            document.getElementById("mistakes").innerHTML += " " + guessedLetter;
            document.hangman.elements["guess"].value = "";
        }
        var isWinner = true;
        for (var i = 0; i < guessWord.length; i++) {
            if (guessWord[i] == "_") {
                isWinner = false;
            }
        }
        if (isWinner) {
            alert("You Won!");
            resetGame();
        }
        if (error_count >= 6) {
            alert("You Lose!");
            resetGame();
        }
    }
    else if (response['action'] == 'hint') {
        var hint = response['wordHint'];
        alert(hint);
    }
}
