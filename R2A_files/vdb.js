$(document).ready(function() {
	$('.continue').click(function(e) {
		e.preventDefault();
	});

	$('#get-started').click(function(e) {
		e.preventDefault();
		$('#intro').animate({opacity: 0}, 100, function() {$('#intro').hide()} );
		$('#prehead1').animate({opacity: 0}, 100, function() {$('#prehead1').hide()} );
		$('#head1').show().animate({opacity: '1'}, 100);
		$('#tiles1').show().animate({opacity: '1'}, 400).animate({height: $('#tiles1').scrollHeight}, 400, function() {$(this).height('auto')});
	})

	$('.cat').click(function() {
		// highlight the category tile
		$('.cat').removeClass('selected');
		$(this).addClass('selected');

		// display only tiles of the selected category
		var category = $(this).attr('data-category-activate');
		$("#tiles1 .tile").parents('.main-row').not('[data-categories~="'+category+'"]').hide();
		$("#tiles1 .tile").parents('.main-row[data-categories~="'+category+'"]').show();
	});

	$('.tile').click(function(e) {
		e.preventDefault();

		// Transition the tiles
		var $tiles_section = $(this).parents('.dynamic-tiles');
		$tiles_section.animate({height: '0px'}, 400, function() {$tiles_section.hide()});
		$nexttilesection = $tiles_section.nextAll('.dynamic-tiles').first();
		$nexttilesection.show().animate({height: $nexttilesection.scrollHeight}, 400, function() {$(this).height('auto')});

		// Hide the preheading
		var $prehead_section = $('#pre' + $tiles_section.attr('data-partner'));
		$nextpreheadsection = $prehead_section.nextAll('.prehead').first();
		$nextpreheadsection.animate({opacity: 0}, 100, function() {$nextpreheadsection.hide()} );

		// Transition the heading
		var $head_section = $('#' + $tiles_section.attr('data-partner'));
		$head_section.nextAll('.dynamic-head').first().show().animate({opacity: '1'}, 100);
		$head_section.animate({opacity: 0}, 100, function() {$head_section.hide()} );

		// Reset all tiles to unselected, and continue button to inactive
		resetTilesAndButtons();
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
		var step = $(this).attr('data-step');
		var $prev_head_section = $('#head' + step);
		$prev_head_section.show().animate({opacity: '1'}, 100);
		$head_section.animate({opacity: 0}, 100, function() {$head_section.hide()} );

		// Transition the preheading
		$('#pre' + $prev_head_section.attr('id')).nextAll('.prehead').show().animate({opacity: '1'}, 100);

		// Transition the tiles
		var $tiles_section = $('#' + $prev_head_section.attr('data-partner'));
		$tiles_section.nextAll('.dynamic-tiles').animate({height: '0px'}, 10, function() {$tiles_section.nextAll('.dynamic-tiles').hide()});
		$tiles_section.show().animate({height: $tiles_section.scrollHeight}, 700, function() {$(this).height('auto')});

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

	$('#chatbot').click(function() {
		$current = $('#chatbot img:visible');
		$current.hide();

		if ($current.next('img').length > 0) {
			$current.next('img').show();
		} else {
			$('#chatbot img:first').show();
		}
	});
});

function resetTilesAndButtons() {
	$('.tile').removeClass('selected');
	$('.continue').addClass('boff').addClass('binactive').removeClass('active').unbind('click');
	$('.boff').click(function(e) {
		e.preventDefault();
	});
}