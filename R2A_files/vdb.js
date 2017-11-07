$(document).ready(function() {
	$('.tile').click(function() {
		$('.tile').removeClass('selected');
		$(this).addClass('selected');

		$('#continue').removeClass('boff').removeClass('binactive').unbind('click');
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
});