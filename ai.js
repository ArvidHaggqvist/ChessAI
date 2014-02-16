function computerTurn() {
	var availableMoves = playboard.generateMoves();
	if(availableMoves.length === 0) {
		alert("Game over");
	}
	//var move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
	//alphaBeta(-5000, 5000, 1, playboard, playboard.turn);
	var move = availableMoves[rootSearch()];
	console.log("Invokations: " + invocations);
	ui.move(move.fromSquare, move.toSquare);
	playboard.turn = otherPlayer(playboard.turn);
	playerTurn();
	//alert(evaluateBoard(playboard, BLACK));
}
function evaluateBoard(board, color, moves) {
	var pieceScore = (color === WHITE) ? board.whitePieceScore - board.blackPieceScore :  board.blackPieceScore - board.whitePieceScore;
	var mobilityScore = (moves) ? 2*moves.length : 2*board.generateMoves().length;
	var score = pieceScore + mobilityScore;
	if(color === BLACK) {
		return score * -1;
	}
	else {
		return score;
	}
}

var maxDepth = 3;
//var bestIndex = 0;
var invocations = 0;

function rootSearch() {
	var bestMoveScore = -100000;
	var bestMoveIndex = 0;
	var moves = playboard.generateMoves();
	moves.forEach(function(mmm, i) {
		var duplicatedBoard = playboard.duplicate();
		duplicatedBoard.makeMove(mmm);
		var s = alphaBeta(-100000, 100000, 2, duplicatedBoard, otherPlayer(duplicatedBoard.turn));
		//var s = -negaMax(2, playboard);
		if(s>bestMoveScore) {
			bestMoveScore = s;
			bestMoveIndex = i;
		}
	});
	console.log(bestMoveScore);
	return bestMoveIndex;
}


function alphaBeta(alpha, beta, depth, board, turn) {
	invocations++;
	board.turn = turn;
	if(depth === maxDepth) {
		return evaluateBoard(board, board.turn);
	}
	//var bestIndex = 0;
	//var bestScore = alpha;
	//var score;

	var moves = board.generateMoves();

	moves.forEach(function(m) {
		var duplicateBoard = board.duplicate();
		duplicateBoard.makeMove(m);

		var score = -alphaBeta(-beta, -alpha, depth+1, duplicateBoard, otherPlayer(turn));

		if(score >= beta) {
			console.log("Invoked");
			return beta;
		}
		if(score > alpha) {
			alpha = score;
		}
	});
	return alpha;

}
/*function negaMax(depth, board) {
	invocations++;
	if(depth === maxDepth) {
		return evaluateBoard(board, board.turn);
	}
	var max = -100000;
	var possibleMoves = board.generateMoves();
	possibleMoves.forEach(function(pm) {
		var d = board.duplicate();
		d.makeMove(pm);
		d.turn = otherPlayer(d.turn);
		var score = -negaMax(depth+1, d);
		if(score > max) {
			max = score;
		}
	});
	return max;
}*/
//alphaBeta(100000, -100000, 1, playboard);