$(document).ready(function() {
	$('.tile').click(function() {
		$('.tile').removeClass('selected');
		$(this).addClass('selected');

		$('#continue').removeClass('boff').removeClass('binactive').unbind('click');
	});

	$('.boff').click(function(e) {
		e.preventDefault();
	});
});