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
            $('#persona-holder').append($('<div class="col sqs-col-2 span-2 cat persona" data-category-activate="' + hyphenize(p.name) + '">\
                                    <img class="persona-icon" src="' + p.icon + '" /><br />\
                                    <span class="catlabel">' + titleCase(p.name) + '</span>\
                                </div>'));
            $('#persona-select').append($('<option value="' + hyphenize(p.name) + '">' + titleCase(p.name) + '</option>"'));
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

            // Populate use cases
            var use_cases = json.use_cases;
            useCasesString = "";
            for (var k = 0; k < use_cases.length; k++) {
                var uc = use_cases[k];
                if (uc.objectives.includes(i)) {
                    if (useCasesString) {
                        useCasesString += ", ";
                    }
                    useCasesString += capitalizeFirstLetter(uc.name);
                }
            }

            $('#tiles1').append($('<div class="main-row row sqs-row objective" id="yui_3_17_2_1_1509478945824_116" data-objective-id="' + i + '" data-categories="' + personasString + '">\
                            <div class="col sqs-col-12 span-12" id="yui_3_17_2_1_1509478945824_115">\
                                <div class="row sqs-row" id="yui_3_17_2_1_1509478945824_114">\
                                    <div class="tile col sqs-col-12 span-12">\
                                           <h3>' + capitalizeFirstLetter(o.name) + '</h3>\
                                           <ul class="tags">' + personasList + '</ul>\
                                           <p class="use_case clear">' + useCasesString + '</p>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>'));
        }

        // Add button
        $('#tiles1').append($('<div class="main-row row sqs-row objective adder" id="yui_3_17_2_1_1509478945824_116" data-objective-id="' + i + '" data-categories="">\
                            <div class="col sqs-col-12 span-12" id="yui_3_17_2_1_1509478945824_115">\
                                <div class="row sqs-row" id="yui_3_17_2_1_1509478945824_114">\
                                    <div class="col sqs-col-12 span-12">\
                                           <p class="use_case clear" style="text-align: center; margin: 36px auto 0;">\
                                               Don\'t see your objective listed? <a href="#" onclick="return false;" style="font-weight: bold; text-decoration: underline;">Add an objective</a>\
                                           </p>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>'));

        // Populate vendors
        var vendors = shuffle(json.vendors);
        for (var i = 0; i < vendors.length; i++) {
            var v = vendors[i];

            if (!v.full_only) {
            
                var technologiesString = "";
                for (var j = 0; j < v.technologies.length; j++) {
                    technologiesString += v.technologies[j]; 
                    if (technologiesString && j < v.technologies.length - 1) {
                        technologiesString += ", ";
                    }
                }
                var useCasesTextString = "";
                for (var k=0; k < v.use_cases_text.length; k++) {
                    useCasesTextString += v.use_cases_text[k];
                    if (useCasesTextString && k < v.use_cases_text.length - 1) {
                        useCasesTextString += ", ";
                    }
                }

                if (useCasesTextString) {
                    if (technologiesString && useCasesTextString) {
                        technologiesString += ", "
                    }
                    technologiesString += useCasesTextString;
                }

                var objective_ids = [];
                for (var k = 0; k < v.use_cases.length; k++) {
                    var uc = json.use_cases[v.use_cases[k]];
                    for (var l = 0; l < uc.objectives.length; l++) {
                        if (!objective_ids.includes(uc.objectives[l])) objective_ids.push(uc.objectives[l]);
                    }
                }

                $('#vendor-holder').append('<div class="row sqs-row vendor" id="yui_3_17_2_1_1509478945824_114" data-use-case-ids="' + v.use_cases.join() + '" data-objective-ids="' + objective_ids.join() + '">\
                                        <div class="col sqs-col-1 span-1">\
                                            &nbsp;\
                                        </div>\
                                        <div class="vtile col sqs-col-10 span-10">\
                                            <div class="vlogo col sqs-col-1-5 span-1-5">\
                                                   <span class="helper"></span><img src="' + v.logo_url + '" />\
                                            </div>\
                                            <div class="vcontent col sqs-col-8-5 span-8-5">\
                                                   <h4 id="vname">' + v.name + '</h4>\
                                                   <p class="location">' + v.location + '</p>\
                                                   <p class="technologies">' + technologiesString + '</p>\
                                                   <p style="display:none" id="vdesc">' + v.description + '</p>\
                                                   <p style="display:none" id="vurl">' + v.url + '</p>\
                                            </div>\
                                        </div>\
                                        <div class="col sqs-col-1 span-1">\
                                               &nbsp;\
                                        </div>\
                                    </div>');
            }
        }
        $('#vendor-holder').append('<div class="row sqs-row vendor adder" id="yui_3_17_2_1_1509478945824_114" data-use-case-ids="">\
                                    <div class="col sqs-col-1 span-1">\
                                        &nbsp;\
                                    </div>\
                                    <div class="col sqs-col-10 span-10">\
                                        <p class="use_case clear" style="text-align: center; margin: 24px auto 0; padding-bottom: 0 !important;">\
                                               Know a vendor that fits this use case? <a href="#" onclick="return false;" style="font-weight: bold; text-decoration: underline;">Add a vendor</a>\
                                           </p>\
                                    </div>\
                                    <div class="col sqs-col-1 span-1">\
                                           &nbsp;\
                                    </div>\
                                </div>');
    });

    $('.continue').click(function(e) {
        e.preventDefault();
    });

    if (localStorage.getItem('disclaimer') == 'shown') {
        goToStep1(1);
    }

    $('#get-started').click(function(e) {
        e.preventDefault();
        goToStep1(100);
        localStorage.setItem('disclaimer','shown');
        customGA('send', 'event', 'Button', 'click', 'get-started');
    });

    function goToStep1(delay) {
        $('#intro').animate({opacity: 0}, delay, function() {$('#intro').hide()} );
        $('#prehead1').animate({opacity: 0}, delay, function() {$('#prehead1').hide()} );
        $('#head1').show().animate({opacity: '1'}, delay);
        $('#tiles1').show().animate({opacity: '1'}, 4*delay).animate({height: $('#tiles1').scrollHeight}, 4*delay, function() {$(this).height('auto')});
    }

    $(document).on('click', '.cat', function() {
        // highlight the category tile
        $('.cat').removeClass('selected');
        $('.cat').each(function() {
            var newsrc = $(this).find('.persona-icon').attr('src').replace('_white.png', '.png').replace('_white', '');
            $(this).find('.persona-icon').attr('src', newsrc);
        });

        $(this).addClass('selected');
        var newsrc = $(this).find('.persona-icon').attr('src').replace('.png', '_white.png'); 
        $(this).find('.persona-icon').attr('src', newsrc);

        var category = $(this).attr('data-category-activate');

        // change the category select
        $('#persona-select option').removeAttr('selected');
        $('#persona-select option[value="'+category+'"]').attr('selected',"selected");

        // display only tiles of the selected category
        $("#tiles1 .tile").parents('.main-row').not('[data-categories~="'+category+'"]').hide();
        $("#tiles1 .tile").parents('.main-row[data-categories~="'+category+'"]').show();
        $("#tiles1 .tile").parents('.main-row.adder').show();


        customGA('send', 'event', 'Persona-Filter-Button', 'select', category);
    });

    $(document).on('change', '#persona-select', function() {
        var category = $(this).val();

        // highlight the category tile
        $('.cat').removeClass('selected');
        $('.cat').each(function() {
            var newsrc = $(this).find('.persona-icon').attr('src').replace('_white.png', '.png').replace('_white', '');
            $(this).find('.persona-icon').attr('src', newsrc);
        });

        $('.cat[data-category-activate="'+category+'"]').addClass('selected');
        if ($(this).find('.persona-icon').attr('src')) {
            var newsrc = $(this).find('.persona-icon').attr('src').replace('.png', '_white.png');
            $(this).find('.persona-icon').attr('src', newsrc);
        }

        // display only tiles of hte selected category
        $("#tiles1 .tile").parents('.main-row').not('[data-categories~="'+category+'"]').hide();
        $("#tiles1 .tile").parents('.main-row[data-categories~="'+category+'"]').show();
        $("#tiles1 .tile").parents('.main-row.adder').show();

        customGA('send', 'event', 'Persona-Filter-Dropdown', 'select', category);
    });

    $(document).on('click', '.cat.selected', function() {
        $('#persona-select option').removeAttr('selected');
        $('#persona-select option[value=""]').attr('selected','selected');
        var newsrc = $(this).find('.persona-icon').attr('src').replace('_white.png', '.png').replace('_white', '');
        $(this).find('.persona-icon').attr('src', newsrc);

        $('.cat').removeClass('selected');
        $('#tiles1 .tile').parents('.main-row').show();

        var category = $(this).attr('data-category-activate');

        customGA('send', 'event', 'Persona-Filter-Button', 'deselect', category);
    });

    $(document).on('click', '.main-row:not(.adder) .tile', function(e) {
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
            $('h3[data-filler="' + $tiles_section.attr('data-partner') + '"]').html($tile.children('h3').html());

            // Before showing them, hide new tiles that don't fall under the selected category
            $nexttilesection = $tiles_section.nextAll('.dynamic-tiles').first();
            $nexttilesection.find('.use-case').show(); // show all
            $nexttilesection.find('.vendor').show(); // show all
            if($tile.parents('.objective')[0]) {
                var objectiveId = $tile.parents('.objective').first().attr('data-objective-id');
                customGA('send', 'event', 'Objective', 'click', objectiveId);
                $nexttilesection.find('.vendor').each(function(){
                    var objectiveIds = $(this).attr('data-objective-ids');
                    if (!objectiveIds || !objectiveIds.split(',').includes(objectiveId)) {
                        $(this).hide();
                    }
                });
            }
            $nexttilesection.find('.vendor.adder').show(); // show add section

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

    $(document).on('click', '.adder a', function(e) {
        e.preventDefault();
        alert("Please contact us at info@r2accelerator.org");
        customGA('send', 'event', 'Adder', 'click', e);
    });

    $('.boff').click(function(e) {
        e.preventDefault();
    });

    $(document).on('click', '.vtile', function() {
        var vname = $(this).find('#vname').html();
        var vdesc = $(this).find('#vdesc').html();
        var vurl = $(this).find('#vurl').html();
        if (vurl) { vdesc += ' (<a target="_blank" href="' + vurl + '">website</a>)'; }
        $('#overlay #vendor-name').html(vname);
        $('#overlay input[name="vendor"]').val(vname);
        $('#overlay #vendor-desc').html(vdesc);
        $('#overlay').show(2);

        // Lock scrolling
        $('body').css({'overflow':'hidden'});
        $(document).bind('scroll',function () { 
             window.scrollTo(0,0); 
        });

        customGA('send', 'event', 'Vendor', 'click', vname);
    });

    $("#overlay #close").click(function() {
        $('#overlay').hide();

        // unlock scrolling
        $(document).unbind('scroll'); 
          $('body').css({'overflow':'visible'});

          customGA('send', 'event', 'Overlay', 'close', '');
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

        customGA('send', 'event', 'EditButton', 'click', step);
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
