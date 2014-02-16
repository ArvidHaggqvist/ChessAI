function computerTurn() {
	var availableMoves = playboard.generateMoves();
	if(availableMoves.length === 0) {
		alert("Game over");
	}
	//var move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
	alphaBeta(100000, -100000, 1, playboard, playboard.turn);
	console.log("Invokations: " + invocations);
	var move = availableMoves[bestIndex];
	ui.move(move.fromSquare, move.toSquare);
	playboard.turn = otherPlayer(playboard.turn);
	playerTurn();
	//alert(evaluateBoard(playboard, BLACK));
}
function evaluateBoard(board, color, moves) {
	var pieceScore = (color === WHITE) ? board.whitePieceScore - board.blackPieceScore :  board.blackPieceScore - board.whitePieceScore;
	var mobilityScore = (moves) ? 2*moves.length : 2*board.generateMoves().length;
	return pieceScore + mobilityScore;
}

var maxDepth = 3;
var bestIndex = 0;
var invocations = 0;
function alphaBeta(alpha, beta, depth, board, turn) {
	invocations++;
	board.turn = turn;
	if(depth === maxDepth) {
		return evaluateBoard(board, board.turn);
	}
	//var bestIndex = 0;
	var bestScore = beta;
	var score;

	var moves = board.generateMoves();

	moves.forEach(function(m, i) {
		var duplicateBoard = board.duplicate();
		duplicateBoard.makeMove(m);
		duplicateBoard.turn = otherPlayer(duplicateBoard.turn);
		score = -alphaBeta(-alpha, -beta, depth+1, duplicateBoard, otherPlayer(turn));
		if(score >= bestScore && maxDepth >= depth) {
			bestScore = score;
			bestIndex = i;
		}
		if(score >= beta) {
			return beta;
		}
		if(score > alpha) {
			alpha = score;
		}
	});
	console.log("Best score: " + bestScore);
	return score;

}
//alphaBeta(100000, -100000, 1, playboard);