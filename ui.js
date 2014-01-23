(function(jQuery, undefined) {

	var gamediv = $(".game");

	// Generate board
	traverseBoard(function(square, index) {
		gamediv.append("<div class='square " + index + "'>" + ((square !== undefined) ? square.type : '') + "</div>");
	});
	$(".square").each(function() {
		var boardIndex = $(this).attr('class').split(" ")[1];
		console.log(boardIndex);
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