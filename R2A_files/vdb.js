function titleCase(str) {
     words = str.split(' ');

     for(var i = 0; i < words.length; i++) {
          var letters = words[i].split('');
          letters[0] = letters[0].toUpperCase();
          words[i] = letters.join('');
     }
     return words.join(' ');
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function hyphenize(str) {
	return str.replace(/\s+/g, '-').toLowerCase();
}

$(document).ready(function() {
	/* Read in db */
	$.getJSON("db.json").done(function(json) { 
		// Populate personas
		var personas = json.personas;
		for (var i = 0; i < personas.length; i++) {
		    var p = personas[i];
		    $('#persona-holder').append($('<div class="col sqs-col-2 span-2 cat persona" data-category-activate="' + hyphenize(p.name) + '">\
		    						<i class="fa ' + p.icon + '"></i><br />\
		    						<span class="catlabel">' + titleCase(p.name) + '</span>\
		    					</div>'));
		}
		$('#persona-holder').append($('<div class="clear">&nbsp;</div>'));

		// Populate objectives
		var objectives = json.objectives;
		for (var i = 0; i < objectives.length; i++) {
		    var o = objectives[i];
		    var personasString = "";
		    var personasList = "";
		    for (var j = 0; j < o.personas.length; j++) {
		    	personasString += hyphenize(personas[o.personas[j]].name) + " ";
		    	personasList += '<li>' + capitalizeFirstLetter(personas[o.personas[j]].name) + '</li>';
		    }
		    $('#tiles1').append($('<div class="main-row row sqs-row objective" id="yui_3_17_2_1_1509478945824_116" data-objective-id="' + i + '" data-categories="' + personasString + '">\
		        			<div class="col sqs-col-12 span-12" id="yui_3_17_2_1_1509478945824_115">\
		        				<div class="row sqs-row" id="yui_3_17_2_1_1509478945824_114">\
		        					<div class="tile col sqs-col-12 span-12">\
		       							<h3>' + capitalizeFirstLetter(o.name) + '</h3>\
		       							<ul class="tags">' + personasList + '</ul>\
		       							<div class="clear">&nbsp;</div>\
		        					</div>\
		        				</div>\
		        			</div>\
		        		</div>'));
		}

		// Populate use cases
		var use_cases = json.use_cases;
		for (var i = 0; i < use_cases.length; i++) {
			var uc = use_cases[i];
			$('#tiles2').append($('<div class="row sqs-row use-case" id="yui_3_17_2_1_1509478945824_116" data-use-case-id="' + i + '" data-objective-ids="' + uc.objectives.join() + '">\
		        			<div class="col sqs-col-12 span-12" id="yui_3_17_2_1_1509478945824_115">\
		        				<div class="row sqs-row" id="yui_3_17_2_1_1509478945824_114">\
		        					<div class="tile col sqs-col-12 span-12">\
		       							<h3>' + capitalizeFirstLetter(uc.name) + '</h3>\
		       							<div class="clear">&nbsp;</div>\
		        					</div>\
		        				</div>\
		        			</div>\
		        		</div>'));
		}

		// Populate vendors
		var vendors = json.vendors;
		for (var i = 0; i < vendors.length; i++) {
			var v = vendors[i];
			var technologiesString = "";
		    for (var j = 0; j < v.technologies.length; j++) {
		    	technologiesString += v.technologies[j]; 
		    	if (j < v.technologies.length - 1) {
		    		technologiesString += ", ";
		    	}
		    }
			$('#vendor-holder').append('<div class="row sqs-row vendor" id="yui_3_17_2_1_1509478945824_114" data-use-case-ids="' + v.use_cases.join() + '">\
		        					<div class="col sqs-col-1 span-1">\
		        						&nbsp;\
		        					</div>\
		        					<div class="vtile col sqs-col-10 span-10">\
			        					<div class="vlogo col sqs-col-1-5 span-1-5">\
			       							<span class="helper"></span><img src="' + v.logo_url + '" />\
			        					</div>\
			        					<div class="vcontent col sqs-col-8-5 span-8-5">\
			       							<h4 id="vname">' + v.name + '</h4>\
			       							<p>' + v.location + '</p>\
			       							<p>' + technologiesString + '</p>\
			       							<p style="display:none" id="vdesc">' + v.description + '</p>\
			        					</div>\
			        				</div>\
		        					<div class="col sqs-col-1 span-1">\
		       							&nbsp;\
		        					</div>\
		        				</div>');
		}
	});

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

	$(document).on('click', '.cat', function() {
		// highlight the category tile
		$('.cat').removeClass('selected');
		$(this).addClass('selected');

		// display only tiles of the selected category
		var category = $(this).attr('data-category-activate');
		$("#tiles1 .tile").parents('.main-row').not('[data-categories~="'+category+'"]').hide();
		$("#tiles1 .tile").parents('.main-row[data-categories~="'+category+'"]').show();
	});
	$(document).on('click', '.cat.selected', function() {
		$('.cat').removeClass('selected');
		$('#tiles1 .tile').parents('.main-row').show();
	});

	$(document).on('click', '.tile', function(e) {
		e.preventDefault();

		// Get the relevant elements
		var $tile = $(this);
		var $tiles_section = $tile.parents('.dynamic-tiles');
		var $head_section = $('#' + $tiles_section.attr('data-partner'));

		// Hide the current heading
		$head_section.animate({opacity: 0}, 400, function() {
			$head_section.hide()
		});

		// Collapse and hide the current tiles
		$tiles_section.animate({height: '0px'}, 400, function() {
			$tiles_section.hide();

			// Update the new heading before showing it
			$('h3[data-filler="' + $tiles_section.attr('data-partner') + '"]').html($(this).children('h3').html());

			// Before showing them, hide new tiles that don't fall under the selected category
			$nexttilesection = $tiles_section.nextAll('.dynamic-tiles').first();
			$nexttilesection.find('.use-case').show(); // show all
			$nexttilesection.find('.vendor').show(); // show all
			if($tile.parents('.objective')[0]) {
				var objectiveId = $tile.parents('.objective').first().attr('data-objective-id');
				$nexttilesection.find('.use-case').each(function(){
					var objectiveIds = $(this).attr('data-objective-ids');
					if (!objectiveIds.split(',').contains(objectiveId)) {
						$(this).hide();
					}
				});
			} else if  ($tile.parents('.use-case')[0]) {
				var useCaseId = $tile.parents('.use-case').first().attr('data-use-case-id');
				$nexttilesection.find('.vendor').each(function(){
					var useCaseIds = $(this).attr('data-use-case-ids');
					if (!useCaseIds.split(',').contains(useCaseId)) {
						$(this).hide();
					}
				});
			}

			// Hide the preheading
			var $prehead_section = $('#pre' + $tiles_section.attr('data-partner'));
			$nextpreheadsection = $prehead_section.nextAll('.prehead').first();
			$nextpreheadsection.animate({opacity: 0}, 100, function() {
				$nextpreheadsection.hide()} 
			);

			// Show the next heading
			$head_section.nextAll('.dynamic-head').first().show().animate({opacity: '1'}, 100, function() {
				// show the next section's tiles
				//$nexttilesection.show().animate({height: $nexttilesection.scrollHeight}, 800, function() {$(this).height('auto')});
				$nexttilesection.height('auto').slideToggle(600, function() {});
			});
		});
	});

	$('.boff').click(function(e) {
		e.preventDefault();
	});

	$(document).on('click', '.vtile', function() {
		var vname = $(this).find('#vname').html();
		var vdesc = $(this).find('#vdesc').html();
		$('#overlay #vendor-name').html(vname);
		$('#overlay #vendor-desc').html(vdesc);
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