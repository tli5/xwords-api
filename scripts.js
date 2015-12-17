
function randomInt(max) {
  return Math.floor(Math.random() * (max));
}

function typeOf (obj) {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

function rotate90(coord, len) {
	var newCoord = {};
	newCoord.row = coord.col;
	newCoord.col = len - coord.row - 1;
	return newCoord;
}

function printBoard(board) {
	console.log("\nprinting board:");
	var len = board.length;
	for (var i = 0; i < len; i++) {
		var msg = "";
		for (var j = 0; j < len; j++) {
			msg += board[i][j];
		}
		console.log(msg);
	}
}

function backUpBoard(board) {
	var backup = [];
	for (var i = 0; i < board.length; i++ ) {
		backup[i] = [];
		for (var j = 0; j < board.length; j++ ) {
			backup[i][j] = board[i][j];
		}
	}
	return backup;
}

function initAnswer(answer, len) {
	answer.len = len;
	for (var i = 0; i < len; i++ ) {
		answer[i] = {};
		for (var j = 0; j < len; j++ ) {
			answer[i][j] = {
				up : {},
				down : {},
				right : {},
				left : {}
			};
		}
	}
}

module.exports.randInt = randomInt;
module.exports.typeOf = typeOf;
module.exports.rotate90 = rotate90;
module.exports.sysout = process.stdout.write;
module.exports.printBoard = printBoard;
module.exports.backUpBoard = backUpBoard;
module.exports.initAnswer = initAnswer;