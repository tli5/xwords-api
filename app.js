var express = require('express');
var fs = require('fs');
var fun = require('./scripts' );

var app = express();
var print = JSON.stringify;
var rand = fun.randInt;
var rotate = fun.rotate90;
var sysout = fun.sysout;
var printBoard = fun.printBoard;
var backUpBoard = fun.backUpBoard;
var initAnswer = fun.initAnswer;

var fdir = "./files/";
var tries = JSON.parse(fs.readFileSync(fdir+"specialTries.json", 'utf8'));
var dictionary = JSON.parse(fs.readFileSync(fdir+"dictionary.json", 'utf8'));

console.log("preparation finished");


app.get('/', function (req, res) {
	res.send('crosswords puzzle api');
});

app.get('/across', function (req, res) {
	res.send('across');
});

app.get('/down', function (req, res) {
	res.send('down');
});

app.get('/word', function (req, res) {
	var len = req.query.len;
	var path = fdir + "words_" + len;
	fs.readFile(path, 'utf8', function (err, data) {
		var msg = {};
		if (err) {
			msg["err"] = err;
		} else {
			msg["data"] = data;
		}
	  	res.send(msg);
	});
});

app.get('/dict', function (req, res) {
	//initialize board
	var len = req.query.len;
	var board = [];
	for (var i = 0; i < len; i++ ) {
		board[i] = [];
		for (var j = 0; j < len; j++ ) {
			board[i][j] = '.';
		}
	}

	var wordMap = [];
	var answer = {};
	var count = 0;
	var tried = 0;
	var threshold = 2000;

	initAnswer(answer, len);
	while (count < Math.floor(0.7 * len * len) && tried < threshold ) {
		placed = placeWords(board, wordMap, tried, answer);
		count += placed;
	}

	printBoard(board);
	console.log("printing answer:");
	console.log(print(answer));
	console.log("------")
	for (var word in wordMap ) {
		console.log(word);
	}

	var playerBoard = {
		board : board,
		answer : answer
	}
	res.send(playerBoard);
});

function placeWords(board, wordMap, tried, answer ) {
	var dirs = [ [0,1], [1, 0], [0, -1], [-1, 0] ];
	var dirStrs = ["right", "down", "left", "up" ];
	var len = board.length;

	var wordLen = rand(len-2)+2;
	var coord = {};
	coord.row = rand(len - wordLen + 1);
	coord.col = rand(len - wordLen + 1);

	var canPlace = true;
	var tmpMap = {
		coordMap : {},
		wordMap : {}
	};
	var boardBackup = backUpBoard(board);
	for (var id = 0; id < 4; id++ ) {
		var dir = dirs[id];
		var row = coord.row;
		var col = coord.col;

		//find pattern to match
		var pattern = [];
		for (var i = 0; i < wordLen; i++ ) {
			var c = board[row][col];
			pattern.push(c);
			row += dir[0];
			col += dir[1];
		}
		canPlace = matchPattern(tries, pattern, wordMap, tmpMap, wordLen, coord );
		if (!canPlace || tmpMap.coordMap[print(coord)] == undefined) {
			board = boardBackup;
			tried += 1;
			return 0;
		} 

		//reset initial row/col
		row = coord.row;
		col = coord.col;
		var startCoord = {
			row : row,
			col : col
		};
		var endCoord = {
			row : row + dir[0] * (wordLen-1),
			col : col + dir[1] * (wordLen-1)
		};

		var word = tmpMap.coordMap[print(coord)];
		for (var i = 0; i < wordLen; i++ ) {
			var c = word.charAt(i);
			board[row][col] = c;
			answer[row][col][dirStrs[id]][word] = {
				startCoord : startCoord,
				endCoord : endCoord,
				index : i,
				meaning : dictionary[word],
				wordLen : wordLen
			};
			//console.log("testing");
			//print(answer);
			//console.log("testing ended");
			row += dir[0];
			col += dir[1];
		}

		coord = rotate(coord, len);
	}

	//copy map
	for (word in tmpMap.wordMap ) {
		wordMap[word] = true;
	}
	return 4 * wordLen;

	
	for (var id = 0; id < 4; id++ ) {
		var dir = dirs[id];
		var word = tmpMap.coordMap[print(coord)];
		console.log("before placing:");
		printBoard(board);
		console.log("--------");
		console.log("word:"+word);
		console.log("coord:"+print(coord) + " "+"dir:"+print(dir) );
		console.log("--------");


		row = coord.row;
		col = coord.col;
		for (var i = 0; i < wordLen; i++ ) {
			var c = word.charAt(i);
			board[row][col] = c;
			row += dir[0];
			col += dir[1];
		}

		printBoard(board);
		console.log("-----------");

		coord = rotate(coord, len);
	}
	return 4 * wordLen;
}

function matchPattern(tries, pattern, wordMap, tmpMap, wordLen, coord ) {
	var node = tries[wordLen];
	if (node == undefined) {
		return false;
	}

	for (var i = 0; i < pattern.length; i++ ) {
		var c = pattern[i];
		if (c != '.' ) {
			if (node == undefined || node.children[i] == undefined || node.children[i][c] == undefined ) {
				return false;
			}
			node = node.children[i][c];
		}
	}

	var words = [];
	findWords(node, words, wordMap, tmpMap, wordLen );
	var word = words[rand(words.length)];
	tmpMap.coordMap[print(coord)] = word;
	tmpMap.wordMap[word] = true;
	return true;
}

function findWords(node, wordList, wordMap, tmpMap, wordLen ) {
	if (node.words.length == 0) {
		var nodes = node.children[wordLen-1];
		for (var c in node.children[wordLen-1] ) {
			var words = node.children[wordLen-1][c].words;
			pushWords(words, wordMap, tmpMap, wordList );
		}
	} else {
		var words = node.words;
		pushWords(words, wordMap, tmpMap, wordList );
	}
	
}

function pushWords(words, wordMap, tmpMap, wordList ) {
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (wordMap[word] == true || tmpMap[word] == true ) {
			continue;
		}
		wordList.push(word);
	}
}

var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address;
	var port = server.address().port;

});

