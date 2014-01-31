(function(jQuery, undefined) {

	var gamediv = $(".game");

	// Generate board
	playboard.traverse(function(square, index) {
		gamediv.append("<div class='square' data-id='" + index + "'>" + ((square !== undefined) ? ((square.color === WHITE) ? square.type : square.type.toUpperCase()) : '') + "</div>");
	});
	$(".square").each(function() {
		var boardIndex = parseInt($(this).attr('data-id'));
		if(rank(boardIndex) % 2 === 0 ) {
			if(boardIndex % 2 !== 0) {
				$(this).addClass('black');
			}
		}
		else {
			if(boardIndex % 2 === 0) {
				$(this).addClass('black');
			}
		}
	});

	var availableMoves = [];

	function playerTurn() {
		availableMoves = playboard.generateMoves();
	}
	playerTurn();

	$(".square").on('click', function() {
		$(".highlight").removeClass('highlight');
		var self = $(this);
		if(turn === WHITE) {
			self.addClass('highlight');
			availableMoves.forEach(function(move) {
				if( parseInt(self.attr('data-id')) === move.fromSquare ) {
					$(".square[data-id='" + move.toSquare + "']").addClass('highlight');
				}
			});
		}
	});


})($);