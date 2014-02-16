var WHITE = 'w',
	BLACK = 'b';

var pieces = {
	ROOK: 'r',
	PAWN: 'p',
	QUEEN: 'q',
	KING: 'k',
	KNIGHT: 'n',
	BISHOP: 'b'
};
var pieceDeltas = {
	q: [-17, -16, -15, -1, 1, 15, 16, 17],
	k: [-17, -16, -15, -1, 1, 15, 16, 17],
	n: [-31, -33, 31, 33, 14, 18, -14, -18],
	b: [-17, -15, 15, 17],
	r: [-16, -1, 1, 16],
	pw: [16, 32, 17,15],
	pb: [-16, -32, -15, -17]
};
var moveTypes = {
	move: 1,
	capture: 2,
	epcapture: 3,
	castling: 4,
	promotion: 5
}
var possibleAttackers = {
	KQR: 1,
	KQBPw: 2,
	KQBPb: 3,
	N: 4,
	QB: 5,
	QR: 6,
};
var pieceAttackers = [
	['k', 'q', 'r'],
	['k', 'q', 'b', 'pw'],
	['k', 'q', 'b', 'pb'],
	['n'],
	['q', 'b'],
	['q', 'r']
];
var pieceValues = {
	k: 10000,
	q: 1200,
	r: 600, 
	b: 400, 
	n: 400,
	p: 100
};

// The central square at index 119 marked as 0 and is the square we're checking to see whether or not it is attacked. The rest of the values are the values of the pieces whose deltas can attack from a given position.
// To check if a square is attacked the formula attackingSquare - attackedSquare + 119. if the value is greater than 0 then the square can be attacked. 
// Read more at this great resource: http://mediocrechess.blogspot.se/2006/12/guide-attacked-squares.html
var attackArray = [
	5, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 5, 0,
	0, 5, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 5, 0, 0,
	0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 5, 0, 0, 0,
	0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0,
	0, 0, 0, 0, 5, 0, 0, 6, 0, 0, 5, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 5, 4, 6, 4, 5, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 4, 2, 1, 2, 4, 0, 0, 0, 0, 0, 0,
	6, 6, 6, 6, 6, 6, 1, 0, 1, 6, 6, 6, 6, 6, 6, 0,
	0, 0, 0, 0, 0, 4, 3, 1, 3, 4, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 5, 4, 6, 4, 5, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 5, 0, 0, 6, 0, 0, 5, 0, 0, 0, 0, 0,
	0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0,
	0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 5, 0, 0, 0,
	0, 5, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 5, 0, 0,
	5, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 5
],
// The deltas neccessary to get to the center square from the attacking positions
// Deltas for knights not necessary as they are not sliding pieces
deltaArray = [
	17, 0, 0, 0, 0, 0, 0,  16, 0, 0, 0, 0, 0, 0, 15, 0,
	0, 17, 0, 0, 0, 0, 0,  16, 0, 0, 0, 0, 0, 15, 0, 0,
	0, 0, 17, 0, 0, 0, 0,  16, 0, 0, 0, 0, 15, 0, 0, 0,
	0, 0, 0, 17, 0, 0, 0,  16, 0, 0, 0, 15, 0, 0, 0, 0,
	0, 0, 0, 0, 17, 0, 0,  16, 0, 0, 15, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 17, 33,  16, 31, 15, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 18, 17,  16, 15, 14, 0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 1, 1, 1,    0, -1, -1, -1, -1, -1, -1, -1, 0,
	0, 0, 0, 0, 0, -14, -15, -16, -17, -18, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, -15, -31, -16, -33, -17, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
	0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
	0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
	0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
	-15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];

//var turn = WHITE;

var startingPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function Board(positions) {

	this.board = positions || new Array(128);

	this.kingPositions = {'w': 4, 'b': 116};

	this.turn = WHITE;

	this.epSquare;

	this.whitePieceScore = 14800;
	this.blackPieceScore = 14800;

	this.traverse = function(action) {
		for(i=0;i<this.board.length;i++) {
			if(i & 0x88) {
				i+=7;
			}
			else {
				action(this.board[i], i);
			}
		}
	};
	this.putPiece = function(piece, square) {
		this.board[square] = piece;
	};
	this.isEmpty = function(square) {
		return (this.board[square]) ? false : true;
	};
	this.isOpponent = function(square) {
		return (this.board[square]) ? ((this.board[square].color === this.turn) ? false : true) : false;
	};
	this.parseFEN = function(fen) {
		var parts = fen.split(" ");
		var boardPositions = parts[0];

		function handlePiece(pieceString) {
			var piece = {
				type: pieceString.toLowerCase(),
				color: ( pieceString.toLowerCase() === pieceString ) ? WHITE : BLACK
			};
			return piece;
		}
		var boardIndex = 0;
		for(i=0; i<boardPositions.length; i++) {
			var character = boardPositions[i];
			
			if(character === '/') {
				boardIndex += 8;
			}
			else if(!isNaN(character)) {
				boardIndex += parseInt(character);
			}
			else {
				this.board[boardIndex] = handlePiece(character);
				boardIndex++;
			}
		}
		console.log(this.board);
	};
	this.isEmpty = function(square) {
		return (this.board[square]) ? false : true;
	};
	this.makeMove = function(move) {

		var from = parseInt(move.fromSquare),
			to = parseInt(move.toSquare);

		// If move is a pawn double move, set the enpassent square
		if(Math.abs(to - from) === 32 && move.piece.type.toLowerCase() === pieces.PAWN) {
			this.epSquare = (to < from) ? from - 16 : from + 16;
		}
		else {
			this.epSquare = undefined; // En-passent only legible for one move
		}

		// Update king position
		if(move.piece.type.toLowerCase() === pieces.KING) {
			this.kingPositions[move.piece.color] = to;
		}
		if(!this.isEmpty(to)) {
			if(this.board[to].color === WHITE) {
				this.whitePieceScore -= pieceValues[this.board[to].type];
			}
			else {
				this.blackPieceScore -= pieceValues[this.board[to].type.toLowerCase()];
			}
		}

		//Make the move
		this.board[from] = undefined;
		this.board[to] = move.piece;
		if(rank(to)+1 === 1 || rank(to)+1 === 8) {
			if(move.piece.type.toLowerCase() === pieces.PAWN) {
				this.board[to] = {type: pieces.QUEEN, color: this.turn};
			}
		}

		/*if(move.type === 'kcastling') {
			this.board[to-1] = this.board[to+3];
			this.board[to +3] = undefined;
		}*/

	};
	this.generateMoves = function() {
		var self = this;
		var moves = [];

		function addMove(from, to, piece, type) {
			var move = {
				fromSquare: from,
				toSquare: to,
				piece: piece,
				movetype: (type) ? type : ''
			}
			moves.push(move);
		}

		var currentPlayer = this.turn,
			opponent = otherPlayer(currentPlayer);

		var pawnDelta = (currentPlayer === WHITE) ? pieceDeltas.pw : pieceDeltas.pb;

		this.traverse(function(val, i) {
			var piece = val;

			if(piece && piece.color === currentPlayer) {

				if(piece.type.toLowerCase() === pieces.PAWN) {
					// One square ahead, doesn't need 0x88 checking as pawn will become another piece before moving off board
					if(self.isEmpty(i+pawnDelta[0])) {
						addMove(i, i+pawnDelta[0], val);
					}
					// Two square move
					if(rank(i)+1 === 2 || rank(i)+1 === 7 ) {
						if(self.isEmpty(i+pawnDelta[0]) && self.isEmpty(i+pawnDelta[1])) {
							if(!(i+pawnDelta[1] & 0x88)) {
								addMove(i, i+pawnDelta[1], val);
							}
						}
					}
					// Pawn capture
					for(j=2; j<4; j++) {
						if(!(i+pawnDelta[j] & 0x88) && self.isOpponent(i+pawnDelta[j])) {
							addMove(i, i+pawnDelta[j], val, 'capture');
						}
					}
				}
				else {
					var deltas = pieceDeltas[piece.type.toLowerCase()];
					for(k=0; k<deltas.length; k++) {
						var delta = deltas[k];
						
						while(!(i+delta & 0x88)) {
							if(!self.isEmpty(i+delta) && !self.isOpponent(i+delta)) {
								break;
							}
							else {
								if(self.isOpponent(i+delta)) {
									addMove(i, i+delta, val);
									break;
								}
								else {
									addMove(i, i+delta, val);
									if(piece.type.toLowerCase() === pieces.KING || piece.type.toLowerCase() === pieces.KNIGHT) {
										break; //Non-sliding pieces only invoke their deltas once
									}
									delta += deltas[k];
								}
							}
						}
					}
				}

			}
		});

		// Castling
		var kingPosition = (currentPlayer === WHITE) ? 4 : 116;

		if(!this.isEmpty(kingPosition) && this.board[kingPosition].type.toLowerCase() === pieces.KING) {
			if(!this.isAttacked(kingPosition, opponent)) {
				var board = this.board;
				// Castling, king side
				if(!this.isAttacked(kingPosition+1, opponent) && this.isEmpty(kingPosition+1) && !this.isAttacked(kingPosition+2, opponent) && this.isEmpty(kingPosition+2) && board[kingPosition+3] && board[kingPosition+3].type.toLowerCase() === pieces.ROOK) {
					addMove(kingPosition, kingPosition+2, board[kingPosition], 'kcastling');
				}
				// Castling, queen side
				if(!this.isAttacked(kingPosition-1, opponent) && this.isEmpty(kingPosition-1) && !this.isAttacked(kingPosition-2, opponent) && this.isEmpty(kingPosition-2) && !this.isAttacked(kingPosition-3, opponent) && this.isEmpty(kingPosition-3) && board[kingPosition-4] && board[kingPosition-4].type.toLowerCase() === pieces.ROOK) {
					addMove(kingPosition, kingPosition-3, board[kingPosition], 'qcastling');
				}
			}
		}

		var legalMoves = this.checkLegal(moves, currentPlayer);

		return legalMoves;
	};

	this.isAttacked = function(square, attackingcolor) {
		
		for(i=0; i<this.board.length; i++) {
			if(i & 0x88) {
				i+= 7
			}
			else {
				var piece = this.board[i];
				if(piece && piece.color === attackingcolor) {
					if(attackArray[i - square + 119] > 0 ) {
						if(inArray(pieceAttackers[attackArray[i - square + 119]-1], (piece.type.toLowerCase() === pieces.PAWN) ? 'p' + piece.color : piece.type.toLowerCase() ) ) {

							if(piece.type.toLowerCase() === pieces.KING || piece.type.toLowerCase() === pieces.KNIGHT || piece.type.toLowerCase() === pieces.PAWN) {		
								 return true; // Non-sliding pieces
							}
							console.log(i);

							var delta = deltaArray[i - square + 119];
							
							for(j=i; j !== square; j+=delta) {
								console.log(j);
								if(!this.isEmpty(j) && j !== i) {
									break;
								}
								if(j+delta === square) {
									return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	};

	this.duplicate = function() {
		return clone(this);
	};
	this.checkLegal = function(moves, color) {	
		var self = this;
		var legal = [];
		moves.forEach(function(move) {
			var b = self.duplicate();
			b.makeMove(move);
			if(!b.inCheck(color)) {
				legal.push(move);
			}
		});
		return legal;
	};
	this.inCheck = function(color) {
		if(this.isAttacked(this.kingPositions[color], otherPlayer(color))) {
			return true;
		}
		else {
			return false;
		}
	};

	this.print = function() {
		var separator = '   +-------------------------+\n';
		var boardString = separator + ' 1 |';

		this.traverse(function(val, i) {
			if(i%8===0 && i !== 0) {
				boardString += ' | \n ' + '12345678'[rank(i)] + ' |';
			}
			if(val !== undefined) {
				(val.color === BLACK) ? boardString +=  ' ' + val.type.toUpperCase() + ' ' : boardString +=  ' ' + val.type + ' ';
			}
			else {
				boardString += ' . ';
			}

		});
		boardString += ' |\n' + separator;
		boardString += '     a  b  c  d  e  f  g  h';
		return boardString;
	};


}

function file(square) {
	return square & 15;
}
function rank(square) {
	return square >> 4;
}
function inArray(arr, val) {
	for(index=0;index<arr.length;index++) {
		if(arr[index] === val) return true;
	}
	return false;
}
function otherPlayer(current) {
	return (current === WHITE) ? BLACK : WHITE;
}

// Taken from here: http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

}


var playboard = new Board(new Array(128));
console.log(playboard);
playboard.parseFEN(startingPosition);
console.log(playboard.generateMoves());

/* Some tests */

/*var testboard = playboard.duplicate();

console.log("\n \n Some very primitive testing");
testboard.putPiece({type: 'p', color: 'b'}, 81);
testboard.putPiece({type: 'q', color: 'w'}, 51);
testboard.putPiece({type: 'q', color: 'b'}, 66);
testboard.putPiece({type: 'q', color: 'b'}, 70);
testboard.putPiece({type: 'p', color: 'b'}, 32);
testboard.makeMove({fromSquare: 16, toSquare: 48, piece: {type: 'p', color: 'w'}, movetype: ''});
testboard.makeMove({fromSquare: 96, toSquare: 64, piece: {type: 'p', color: 'b'}, movetype: ''});

testboard.board[1] = undefined;
testboard.board[2] = undefined;
testboard.board[3] = undefined;
console.log(testboard.generateMoves());
console.log(testboard.print());
console.log(testboard.epSquare);
console.log(testboard.isAttacked(81, WHITE));
console.log(testboard.isAttacked(17, BLACK));
console.log(testboard.isAttacked(22, BLACK));
console.log(testboard.isAttacked(6, BLACK));

testboard.makeMove({fromSquare: 4, toSquare: 67, piece: {type: 'k', color: 'w'}, movetype: ''});
testboard.putPiece({type: 'p', color: 'b'}, 37);
console.log(testboard.kingPositions[WHITE]);
console.log(testboard.print());
console.log(testboard.inCheck(WHITE));
console.log(testboard.isAttacked(37, WHITE));*/