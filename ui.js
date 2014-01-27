(function(jQuery, undefined) {

	var gamediv = $(".game");

	// Generate board
	playboard.traverse(function(square, index) {
		gamediv.append("<div class='square " + index + "'>" + ((square !== undefined) ? ((square.color === WHITE) ? square.type : square.type.toUpperCase()) : '') + "</div>");
	});
	$(".square").each(function() {
		var boardIndex = $(this).attr('class').split(" ")[1];
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


})($);