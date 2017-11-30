$(document).ready(function() {
	$('.continue').click(function(e) {
		e.preventDefault();
	});

	$('.tile').click(function() {
		$('.tile').removeClass('selected');
		$(this).addClass('selected');

		$('.continue').removeClass('boff').removeClass('binactive').addClass('active').unbind('click');
		$('.continue.active').click(function(e) {
			// Prevent the default click action
			e.preventDefault();

			// Transition the heading
			var $head_section = $(this).parents('.dynamic-head');
			$head_section.next('.dynamic-head').show().animate({opacity: '1'}, 100);
			$head_section.animate({opacity: 0}, 100, function() {$head_section.hide()} );

			// Transition the tiles
			var $tiles_section = $('#' + $head_section.attr('data-partner'));
			$tiles_section.animate({height: '0px'}, 400, function() {$tiles_section.hide()});
			$tiles_section.next('.dynamic-tiles').show().animate({height: $tiles_section.next('.dynamic-tiles').get(0).scrollHeight}, 400, function() {$(this).height('auto')});

			// Reset all tiles to unselected, and continue button to inactive
			resetTilesAndButtons();
		});
	});

	$('.boff').click(function(e) {
		e.preventDefault();
	});

	$('.vtile').click(function() {
		$('html, body').animate({scrollTop:0}, "fast");
		$('#overlay').show(2);
	});

	$("#overlay #close").click(function() {
		$('#overlay').hide();
	});

	$('.edit').click(function(e) {
		// Prevent the default click action
		e.preventDefault();

		// Transition the heading
		var $head_section = $(this).parents('.dynamic-head');
		$head_section.prev('.dynamic-head').show().animate({opacity: '1'}, 100);
		$head_section.animate({opacity: 0}, 100, function() {$head_section.hide()} );

		// Transition the tiles
		var $tiles_section = $('#' + $head_section.attr('data-partner'));
		$tiles_section.animate({height: '0px'}, 10, function() {$tiles_section.hide()});
		$tiles_section.prev('.dynamic-tiles').show().animate({height: $tiles_section.prev('.dynamic-tiles').get(0).scrollHeight}, 700, function() {$(this).height('auto')});

		// Reset all tiles to unselected, and continue button to inactive
		resetTilesAndButtons();
	});

	$('.reset').click(function(e) {
		// Prevent the default click action
		e.preventDefault();

		// Transition the heading
		var $head_section = $(this).parents('.dynamic-head');
		$head_section.siblings('.dynamic-head').first().show().animate({opacity: '1'}, 100);
		$head_section.animate({opacity: 0}, 100, function() {$head_section.hide()} );

		// Transition the tiles
		var $tiles_section = $('#' + $head_section.attr('data-partner'));
		$tiles_section.animate({height: '0px'}, 10, function() {$tiles_section.hide()});
		$tiles_section.siblings('.dynamic-tiles').first().show().animate({height: $tiles_section.siblings('.dynamic-tiles').first().get(0).scrollHeight}, 700, function() {$(this).height('auto')});

		// Reset all tiles to unselected, and continue button to inactive
		resetTilesAndButtons();
	});
});

function resetTilesAndButtons() {
	$('.tile').removeClass('selected');
	$('.continue').addClass('boff').addClass('binactive').removeClass('active').unbind('click');
	$('.boff').click(function(e) {
		e.preventDefault();
	});
}