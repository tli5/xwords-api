var fdir = "./files/";
var dict = require(fdir + 'dictionary.json');
var fs = require('fs');

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

for (var word in dict ) {
	var len = word.length;
	if (words[len] == undefined) {
		words[len] = [];
	}	
	words[len].push(word);
}

words.forEach(function(wordArr, len) {
	var path = fdir + "words_"+len;
	fs.open(path, "w+", function(err, fd) {
		var json = {};
		json["length"] = len;
		json["words"] = words[len];
		fs.write(fd, print(json), function() {
			fs.close(fd);
		});
	} );
} );


