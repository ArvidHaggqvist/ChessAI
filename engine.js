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

var attackArray = [],
	deltaArray = [];

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
function makeMove(move) {
	var from = move.fromSquare,
		to = move.toSquare;

	// If move is a pawn double move, set the enpassent square
	if(Math.abs(to - from) === 32 && move.piece.type === pieces.PAWN) {
		epSquare = (to < from) ? from - 16 : from + 16;
	}
	board[from] = undefined;
	board[to] = move.piece;
}

function generateMoves() {
	var moves = [];

	function addMove(from, to, piece) {
		var move = {
			fromSquare: from,
			toSquare: to,
			piece: piece,
			movetype: ''
		}
		moves.push(move);
	}

	var currentPlayer = turn,
		otherPlayer = (turn === WHITE) ? BLACK : WHITE;

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

	return moves;
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

function init() {
	parseFEN(startingPosition);
	//putPiece({type: 'p', color: 'b'}, 51);
	//putPiece({type: 'q', color: 'w'}, 81);
	makeMove({fromSquare: 16, toSquare: 48, piece: {type: 'p', color: 'w'}, movetype: ''});
	makeMove({fromSquare: 96, toSquare: 64, piece: {type: 'p', color: 'b'}, movetype: ''});
	console.log(generateMoves());
	console.log(printBoard());
	console.log(epSquare);
}
init();