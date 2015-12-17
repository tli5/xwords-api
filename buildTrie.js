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

var path = fdir + "tries";
fs.open(path, "w+", function(err, fd) {
	for (var word in dict ) {
		var wordArr = word.split("");
		var len = word.length;

		tries[len] = tries[len] == undefined? {
			val : ".",
			nodes : {},
			isword : false
		} : tries[len];
		push(tries[len] , wordArr, 0);
	}

	fs.write(fd, str, function() {
		fs.close(fd);
	});
} );

function push(root, str, i) {
	if (i == str.length ) {
		root.isword = true;
		return;
	}
	var c = str[i];
	var node;

	if (root.nodes[c] == undefined ) {
		node = {};
		node.val = c;
		node.nodes = {};
		node.isword = false;
		root.nodes[c] = node;
	} 
	node = root.nodes[c];
	push(node, str, i+1);
}
