
	var gamediv = $(".game");

	var ui = {
		move: function(from, to) {
			var fromSquare = $(".square[data-id='" + from + "']");
			var piece = fromSquare.attr('data-piece');
			var UIPiece = fromSquare.text();
			fromSquare.text("");
			var toSquare = $(".square[data-id='" + to + "']");
			toSquare.text(UIPiece);
			toSquare.attr('data-piece', piece);
			toSquare.attr('data-color', fromSquare.attr('data-color'));
			var move = {fromSquare: from, toSquare: to, piece: {type: piece, color: fromSquare.attr('data-color')}};
			fromSquare.attr('data-color', '');
			fromSquare.attr('data-piece', '');
			playboard.makeMove(move);
			if(playboard.inCheck(BLACK)) {
				alert("Check");
			}
			if(playboard.inCheck(WHITE)) {
				alert("Check");
			}
		}
	};

	var pieceSymbols = {
		'p': '♟',
		'r': '♜',
		'k': '♚',
		'q': '♛',
		'n': '♞',
		'b': '♝'
	};

	// Generate board
	playboard.traverse(function(square, index) {
		if(square !== undefined) {
			gamediv.append("<div class='square' data-id='" + index + "' data-piece='" + square.type + "' data-color='" + square.color + "'>" + pieceSymbols[square.type] + "</div>");
		}
		else {
			gamediv.append("<div class='square' data-id='" + index + "'></div>");
		}
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
			$(".selected").removeClass("selected");
			turn = otherPlayer(turn);
			computerTurn();
		}
		else {
			$(".highlight").removeClass('highlight');
			$(".selected").removeClass('selected');
			var self = $(this);
			if(turn === WHITE) {
				self.addClass('selected');
				availableMoves.forEach(function(move) {
					if( parseInt(self.attr('data-id')) === move.fromSquare ) {
						$(".square[data-id='" + move.toSquare + "']").addClass('highlight');
					}
				});
			}
		}
	});
