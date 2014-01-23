(function(jQuery, undefined) {

	var gamediv = $(".game");

	// Generate board
	traverseBoard(function(square, index) {
		gamediv.append("<div class='square " + index + "'>" + ((square !== undefined) ? square.type : '') + "</div>");
	});

})($);