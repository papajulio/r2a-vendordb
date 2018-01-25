function hyphenize(str) {
	return str.replace(/\s+/g, '-').toLowerCase();
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

$(document).ready(function() {
	/* Read in db */
	$.getJSON("db.json").done(function(json) { 
		// Populate personas
		var personas = json.personas;
		for (var i = 0; i < personas.length; i++) {
		    var p = personas[i];
		    // Need to populate personas?
		}

		// Populate objectives
		var objectives = json.objectives;
		for (var i = 0; i < objectives.length; i++) {
		    var o = objectives[i];
			$optgroup = $('<optgroup label="Objective: ' + capitalizeFirstLetter(o.name) + '"></optgroup>');

			// Populate use cases
			var use_cases = json.use_cases;
			for (var j = 0; j < use_cases.length; j++) {
				var uc = use_cases[j];

				if (uc.objectives.includes(i)) {
					$optgroup.append($('<option value="' + j + '">' + capitalizeFirstLetter(uc.name) + "</option>"));
				}
			}
		    $('#filters').append($optgroup);
		}

		// Populate vendors
		var vendors = shuffle(json.vendors);
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

	$('#filters').change(function() {
		var useCaseId = $(this).val();
		$('.vendor').show(); // show all

		if (useCaseId) {
			$('.vendor').each(function(){
				var useCaseIds = $(this).attr('data-use-case-ids');
				if (!useCaseIds.split(',').includes(useCaseId)) {
					$(this).hide();
				}
			});
		}
	});

	$(document).on('click', '.vtile', function() {
		var vname = $(this).find('#vname').html();
		var vdesc = $(this).find('#vdesc').html();
		$('#overlay #vendor-name').html(vname);
		$('#overlay input[name="vendor"]').val(vname);
		$('#overlay #vendor-desc').html(vdesc);
		$('#overlay').show(2);

		// Lock scrolling
		$('body').css({'overflow':'hidden'});
		$(document).bind('scroll',function () { 
		     window.scrollTo(0,0); 
		});
	});

	$("#overlay #close").click(function() {
		$('#overlay').hide();

		// unlock scrolling
		$(document).unbind('scroll'); 
  		$('body').css({'overflow':'visible'});
	});
});