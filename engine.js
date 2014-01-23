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
	n: [-31, -33, 31, 33],
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
	0, 0, 0, 0, 0, 17, 0,  16, 0, 15, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 17,  16, 15, 0, 0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 1, 1, 1,    0, -1, -1, -1, -1, -1, -1, -1, 0,
	0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
	0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
	0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
	0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
	-15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];

var turn = WHITE;
var epSquare;

var board = new Array(128);

var startingPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function traverseBoard(action) {
	for(i=0;i<board.length;i++) {
		if(i & 0x88) {
			i+=7;
		}
		else {
			action(board[i], i);
		}
	}
}

function putPiece(piece, square) {
	board[square] = piece;
}
function isEmpty(square) {
	return (board[square]) ? false : true;
}
function isOpponent(square) {
	//return (board[square].color === turn) ? false : true;
	return (board[square]) ? ((board[square].color === turn) ? false : true) : false;
}
function otherPlayer(current) {
	return (current === WHITE) ? BLACK : WHITE;
}
function parseFEN(fen) {
	var parts = fen.split(" ");
	var boardPositions = parts[0];

	function handlePiece(pieceString) {
		var piece = {
			type: pieceString.toLowerCase(),
			color: ( pieceString.toLowerCase() === pieceString ) ? WHITE : BLACK
		}
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
			board[boardIndex] = handlePiece(character);
			boardIndex++;
		}
	}
	console.log(board);
}
function makeMove(move, chessboard) {

	if(!chessboard) {
		chessboard = board;
	}
	var from = move.fromSquare,
		to = move.toSquare;

	// If move is a pawn double move, set the enpassent square
	if(Math.abs(to - from) === 32 && move.piece.type === pieces.PAWN) {
		epSquare = (to < from) ? from - 16 : from + 16;
	}
	else {
		epSquare = undefined; // En-passent only legible for one move
	}
	chessboard[from] = undefined;
	chessboard[to] = move.piece;
}

function generateMoves() {
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

	var currentPlayer = turn,
		opponent = otherPlayer(currentPlayer);

	var pawnDelta = (currentPlayer === WHITE) ? pieceDeltas.pw : pieceDeltas.pb;

	traverseBoard(function(val, i) {
		var piece = val;

		if(piece && piece.color === currentPlayer) {

			if(piece.type === pieces.PAWN) {
				// One square ahead, doesn't need 0x88 checking as pawn will become another piece before moving off board
				if(isEmpty(i+pawnDelta[0])) {
					addMove(i, i+pawnDelta[0], val);
				}
				// Two square move
				if(rank(i)+1 === 2 || rank(i)+1 === 7 ) {
					if(isEmpty(i+pawnDelta[0])) {
						if(!(i+pawnDelta[1] & 0x88)) {
							addMove(i, i+pawnDelta[1], val);
						}
					}
				}
				// Pawn capture
				for(j=2; j<4; j++) {
					if(!(i+pawnDelta[j] & 0x88) && board[i+pawnDelta[j]] !== undefined && board[i+pawnDelta[j]].color === otherPlayer) {
						addMove(i, i+pawnDelta[j], val);
					}
				}
			}
			else {
				var deltas = pieceDeltas[piece.type];
				for(k=0; k<deltas.length; k++) {
					var delta = deltas[k];
					
					while(!(i+delta & 0x88)) {
						if(!isEmpty(i+delta) && !isOpponent(i+delta)) {
							break;
						}
						else {
							if(isOpponent(i+delta)) {
								addMove(i, i+delta, val);
								break;
							}
							else {
								addMove(i, i+delta, val);
								if(piece.type === pieces.KING || piece.type === pieces.KNIGHT) {
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

	if(!isEmpty(kingPosition) && board[kingPosition].type === pieces.KING) {
		if(!isAttacked(kingPosition)) {
			// Castling, king side
			if(!isAttacked(kingPosition+1, opponent) && isEmpty(kingPosition+1) && !isAttacked(kingPosition+2, opponent) && isEmpty(kingPosition+2) && board[kingPosition+3] && board[kingPosition+3].type === pieces.ROOK) {
				addMove(kingPosition, kingPosition+2, board[kingPosition], 'kcastling');
			}
			// Castling, queen side
			if(!isAttacked(kingPosition-1, opponent) && isEmpty(kingPosition-1) && !isAttacked(kingPosition-2, opponent) && isEmpty(kingPosition-2) && !isAttacked(kingPosition-3, opponent) && isEmpty(kingPosition-3) && board[kingPosition-4] && board[kingPosition-4].type === pieces.ROOK) {
				addMove(kingPosition, kingPosition-3, board[kingPosition], 'qcastling');
			}
		}
	}

	return moves;
}
function isAttacked(square, attackingcolor) {
	var attacked;
	traverseBoard(function(piece, i) {
		if(piece && piece.color === attackingcolor) {
			if(attackArray[i - square + 119] > 0 ) {
				if(inArray(pieceAttackers[attackArray[i - square + 119]-1], (piece.type === pieces.PAWN) ? 'p' + piece.color : piece.type ) ) {

					if(piece.type === pieces.KING || piece.type === pieces.KNIGHT) {
						attacked = true; // Non-sliding pieces
					}
					console.log(i);

					var delta = deltaArray[i - square + 119];
					
					for(j=i; j !== square; j+=delta) {
						console.log(j);
						if(!isEmpty(j) && j !== i) {
							attacked = false;
							break;
						}
						if(j+delta === square) {
							attacked = true;
							break;
						}
					}
				}
			}
		}
		
	});
	return attacked;
}

function duplicateBoard(board) {
	var newBoard = new Array(128);
	traverseBoard(function(square, i) {
		newBoard[i] = square;
	});
	return newBoard;
}

function printBoard() {
	var separator = '   +-------------------------+\n';
	var boardString = separator + ' 1 |';

	traverseBoard(function(val, i) {
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

function init() {
	parseFEN(startingPosition);
	putPiece({type: 'p', color: 'b'}, 81);
	putPiece({type: 'q', color: 'w'}, 51);
	putPiece({type: 'q', color: 'b'}, 66);
	putPiece({type: 'q', color: 'b'}, 70);
	putPiece({type: 'p', color: 'b'}, 32);
	makeMove({fromSquare: 16, toSquare: 48, piece: {type: 'p', color: 'w'}, movetype: ''});
	makeMove({fromSquare: 96, toSquare: 64, piece: {type: 'p', color: 'b'}, movetype: ''});
	//board[5] = undefined;
	//board[6] = undefined;
	//board[22] = undefined;
	board[1] = undefined;
	board[2] = undefined;
	board[3] = undefined;
	console.log(generateMoves());
	console.log(printBoard());
	console.log(epSquare);
	console.log(isAttacked(81, WHITE));
	console.log(isAttacked(17, BLACK));
	console.log(isAttacked(22, BLACK));
	console.log(isAttacked(6, BLACK));
}
init();