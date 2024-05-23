//EECS1012 Term Project
//Negar Khalilazar, student ID#221037437
//server_side.js: Server Side Code
var express = require('express');
var app = express();
var idCounter = 0;
var gameInfo = {};
var port = 3000;

app.post('/post', (req, res) => {
    console.log("New express client");
    console.log("Query received: ");
    console.log(JSON.parse(req.query['data']));
    res.header("Access-Control-Allow-Origin", "*");
    var queryInfo = JSON.parse(req.query['data']);
    if (queryInfo['action'] == 'generateWord') {
        idCounter++;
        var nameID = queryInfo['name'] + idCounter;
        generateWord(nameID);
        var jsontext = JSON.stringify({
            'action': 'generateWord',
            'nameID': nameID,
            'len': gameInfo[nameID][0].length,
            'msg': 'New word generated!!!'
        });
        res.send(jsontext);
    } else if (queryInfo['action'] == "evaluate") {
        var nameID = queryInfo['name'];
        var clientData = gameInfo[nameID];
        var [correct, counter, attemptWord] = makeGuess(clientData, queryInfo['letterGuess'], queryInfo['guessWord']);
        gameInfo[nameID][1] = counter;
        var jsontext = JSON.stringify({
            'action': 'evaluate',
            'correct': correct,
            'attemptWord': attemptWord,
            'num_errors': counter
        });
        console.log(jsontext);
        res.send(jsontext);
    } else if (queryInfo['action'] == "hint") {
        var nameID = queryInfo['name'];
        var clientData = gameInfo[nameID];
        var wordHint = clientData[2];
        var jsontext = JSON.stringify({
            'name': nameID,
            'action': 'hint',
            'wordHint': wordHint
        });
        console.log(jsontext);
        res.send(jsontext);
    } else {
        res.send(JSON.stringify({ 'msg': 'error!!!' }));
    }
}).listen(3000);
console.log("Server is running on 3000!");

function makeGuess(input, letterGuess, attemptWord) {
    var correct = false;
    var secretWord = input[0];
    var num_errors = input[1];
    for (var i = 0; i < secretWord.length; i++) {
        if (secretWord[i] == letterGuess) {
            attemptWord[i] = letterGuess;
            correct = true;
        }
    }
    if (!correct) {
        num_errors++;
    }
    return [correct, num_errors, attemptWord];
}

function generateWord(clientName) {
    var wordHints = [
        { word: ["R", "A", "D", "I", "O"], hint: "They used to call this device a wireless telegraph" },
        { word: ["T", "E", "A", "M", "W", "O", "R", "K"], hint: "We were going to do this project this way pre-strike" },
        { word: ["W", "E", "B", "D", "E", "S", "I", "G", "N"], hint: "This course is all about it" },
        { word: ["E", "D", "U", "C", "A", "T", "I", "O", "N"], hint: "You most probably need it to get a good job" },
        { word: ["C", "H", "O", "C", "O", "L", "A", "T", "E"], hint: "You can find this in powder or bar form" },
        { word: ["U", "N", "I", "V", "E", "R", "S", "I", "T", "Y"], hint: "What York, Waterloo, Toronto, McMaster, etc. are" }
    ];
    var index = Math.floor(Math.random() * wordHints.length);
    var word = Object.values(wordHints[index])[0];
    var hint = Object.values(wordHints[index])[1];
    gameInfo[clientName] = [word, 0, hint];
}