function computerTurn() {
	var availableMoves = playboard.generateMoves();
	if(availableMoves.length === 0) {
		alert("Game over");
	}
	var move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
	ui.move(move.fromSquare, move.toSquare);
	turn = otherPlayer(turn);
	playerTurn();
}
function evaluateBoard(board, color, moves) {
	var pieceScore = (color === WHITE) ? board.whitePieceScore - board.blackPieceScore :  board.whitePieceScore - board.blackPieceScore;
	var mobilityScore = (moves) ? 2*moves.length : 2*generateMoves().length;
	return pieceScore + mobilityScore;
}
/*var maxDepth = 3;
function alphaBeta(alpha, beta, depth, board) {
	if(depth === maxDepth) {
		return evaluateBoard(board, )
	}
}
alphaBeta(100000, -100000, 1, playboard);*/