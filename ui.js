//(function(jQuery, undefined) {

	var gamediv = $(".game");

	var ui = {
		move: function(from, to) {
			console.log("invoked");
			var fromSquare = $(".square[data-id='" + from + "']");
			var piece = fromSquare.text();
			fromSquare.text("");
			$(".square[data-id='" + to + "']").text(piece);
			var move = {fromSquare: from, toSquare: to, piece: {type: piece, color: (piece.toUpperCase() === piece) ? BLACK : WHITE}};
			playboard.makeMove(move);
			console.log(playboard.print());
			console.log(playboard.kingPositions);
		}
	};

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
		if($(this).hasClass('highlight')) {
			$(".highlight").removeClass("highlight");
			ui.move($(".selected").attr('data-id'), $(this).attr('data-id'));
			turn = otherPlayer(turn);
			computerTurn();
		}
		else {
			$(".highlight").removeClass('highlight');
			$(".selected").removeClass('selected');
			var self = $(this);
			if(turn === WHITE) {
				self.addClass('highlight');
				self.addClass('selected');
				availableMoves.forEach(function(move) {
					if( parseInt(self.attr('data-id')) === move.fromSquare ) {
						$(".square[data-id='" + move.toSquare + "']").addClass('highlight');
					}
				});
			}
		}
	});


//})($);