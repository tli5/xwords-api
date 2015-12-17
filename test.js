var fun = require('./scripts' );
var rotate = fun.rotate90;
var sysout = fun.sysout;
var printBoard = fun.printBoard;
var fs = require('fs');
var express = require('express');
var typeOf = fun.typeOf;
var util = require('util');
var initAnswer = fun.initAnswer;

function testRotate() {
	var len = 5;
	var coord = {};
	coord.row = 3;
	coord.col = 1;

	var board = [];
	for (var i = 0; i < len; i++ ) {
		board[i] = [];
		for (var j = 0; j < len; j++ ) {
			board[i][j] = 'X';
		}
	}

	for (var i = 0; i < 4; i++ ) {
		var row = coord.row;
		var col = coord.col;
		board[row][col] = i;
		coord = rotate(coord, len);
	}
	printBoard(board, len);
}

function loadTrie() {
	//var trie = fs.readFileSync('./files/trie', 'utf8');
	
	//trie = JSON.parse(trie);
	//var trie = require('./files/trie.json');
	var ob = {};
	ob["val"] = 3;
	ob["str"] = "333";
	ob.child = {};
	ob.child.val = 6;
	ob.child.d = "ddd";

	console.log(JSON.stringify(ob, replacer) );
}

function replacer(key, value) {
	if (typeOf(value) === "object" ) {
		return JSON.stringify(value, replacer);
	} else {
		return value;
	}
	
}

function testDriver() {
	//testRotate();
	//loadTrie();
	
}

testDriver();