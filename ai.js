function computerTurn() {
	var availableMoves = playboard.generateMoves();
	if(availableMoves.length === 0) {
		alert("Game over");
	}
	var move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
	ui.move(move.fromSquare, move.toSquare);
	playboard.turn = otherPlayer(playboard.turn);
	playerTurn();
}
function evaluateBoard(board, color, moves) {
	var pieceScore = (color === WHITE) ? board.whitePieceScore - board.blackPieceScore :  board.whitePieceScore - board.blackPieceScore;
	var mobilityScore = (moves) ? 2*moves.length : 2*generateMoves().length;
	return pieceScore + mobilityScore;
}

/*var maxDepth = 3;
function alphaBeta(alpha, beta, depth, board, turn) {
	board.turn = turn;
	if(depth === maxDepth) {
		return evaluateBoard(board, board.turn);
	}
	var bestIndex = 0;
	var bestScore = 0;
	var score;

	var moves = board.generateMoves();

	moves.forEach(function(m, i) {
		var duplicateBoard = board.duplicate();
		duplicateBoard.makeMove(move);
		score = -alphaBeta(-alpha, -beta, depth+1, duplicateBoard, otherPlayer(turn));
		if(score >= bestScore) {
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
	return score;

}
alphaBeta(100000, -100000, 1, playboard);*/