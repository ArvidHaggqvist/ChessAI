function computerTurn() {
	var availableMoves = playboard.generateMoves();
	if(availableMoves.length === 0) {
		alert("Game over");
	}

	var move = availableMoves[rootSearch()];
	console.log("Invokations: " + invocations);
	ui.move(move.fromSquare, move.toSquare);
	playboard.turn = otherPlayer(playboard.turn);
	playerTurn();
}
function evaluateBoard(board, color, moves) {
	var pieceScore = (color === WHITE) ? board.whitePieceScore - board.blackPieceScore :  board.blackPieceScore - board.whitePieceScore;
	var mobilityScore = (moves) ? 2*moves.length : 2*board.generateMoves().length;
	var score = pieceScore + mobilityScore;
	return score;
}

var maxDepth = 3;
var invocations = 0;

function rootSearch() {
	var bestMoveScore = -100000;
	var bestMoveIndex = 0;
	var moves = playboard.generateMoves();
	moves.forEach(function(mmm, i) {
		var duplicatedBoard = playboard.duplicate();
		duplicatedBoard.makeMove(mmm);
		var s = -alphaBeta(-100000, 100000, 2, duplicatedBoard, otherPlayer(duplicatedBoard.turn));
		if(s>bestMoveScore) {
			bestMoveScore = s;
			bestMoveIndex = i;
		}
	});
	console.log("Best move score: " + bestMoveScore);
	return bestMoveIndex;
}


function alphaBeta(alpha, beta, depth, board, turn) {
	invocations++;
	board.turn = turn;
	if(depth === maxDepth) {
		return evaluateBoard(board, board.turn);
	}
	if(depth === maxDepth-1) {
		console.log("Current player: " + board.turn);
		//console.log(board.print());
	}

	var moves = board.generateMoves();

	moves.forEach(function(m) {
		var duplicateBoard = board.duplicate();
		duplicateBoard.makeMove(m);

		var score = -alphaBeta(-beta, -alpha, depth+1, duplicateBoard, otherPlayer(turn));

		if(score >= beta) {
			console.log("Beta cutoff");
			return beta;
		}
		if(score > alpha) {
			alpha = score;
		}
	});
	return alpha;

}