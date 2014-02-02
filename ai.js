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