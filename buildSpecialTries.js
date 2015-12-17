var fdir = "./files/";
var dict = require(fdir + 'dictionary.json');
var fs = require('fs');
var util = require('util');

if (!Array.prototype.forEach)
{
   Array.prototype.forEach = function(fun /*, thisp*/)
   {
      var len = this.length;
      if (typeof fun != "function")
      throw new TypeError();
      
      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
      {
         if (i in this)
         fun.call(thisp, this[i], i, this);
      }
   };
}

var words = [];
var print = JSON.stringify;
var tries = {};
var maxLen = 7;

var path = fdir + "specialTries.json";
fs.open(path, "w+", function(err, fd) {
	for (var word in dict ) {
		var wordArr = word.split("");
		var len = word.length;
		if (!examineWord(word) ) {
			continue;
		}
		if (tries[len] == undefined ) {
			tries[len] = {
				words : [],
				children : {}
			};
		}
		push(tries[len] , wordArr, 0, word);
	}
	var strTrie = print(tries);
	fs.write(fd, strTrie, function() {
		fs.close(fd);
	});
} );

function examineWord(word) {
	if (word.length > maxLen ) {
		return false;
	}
	var wordArr = word.split("");
	for (var i = 0; i < word.length; i++ ) {
		if (wordArr[i] < 'A' || wordArr[i] > 'Z' ) {
			return false;
		}
	}
	return true;
}

function push(node, arr, start, word ) {
	if (start == arr.length ) {
		node.words.push(word);
		return;
	}

	for (var i = start; i < arr.length; i++ ) {
		var c = arr[i];

		if (node.children[i] == undefined ) {
			node.children[i] = {};
		}
		if (node.children [i][c] == undefined ) {
			node.children [i][c] = {};
			node.children [i][c].words = [] ;
			node.children [i][c].children = {};
		}
		push(node.children[i][c], arr, i+1, word );
	}
}
