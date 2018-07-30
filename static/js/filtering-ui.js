function vendorWasClicked(e) {
    var vendorData = vendors[$(this).attr("data-vendor-id")];
    var vendorTechs = '';
    for (var techId of vendorData['t']) {
        vendorTechs += vendorTechs ? ', ' : '';
        vendorTechs += technologies[techId]['n'];
    }
    var vendorGeos = '';
    for (var geo of vendorData['g']) {
        if (['Africa', 'Europe', 'America', 'Asia'].indexOf(geo) >= 0) {
            continue;
        }
        vendorGeos += vendorGeos ? ', ' : '';
        vendorGeos += geo;
    }
    var title =
        '<span class="vendor-modal-title-text">' + vendorData['n'] + '</span>\
        <i class="fa fa-times vendor-modal-close-times" onclick="myModal.close();"></i>';
    var content =
        '<div class="vendor-modal-content">\
            <div class="sqs-row vendor-modal-logo">\
                <img src="' + vendorData['lu'] + '" class="vendor-modal-logo-image" />\
            </div>\
            <div class="sqs-row justify">\
                <span class="vendor-modal-description-text">' + vendorData['d'] + '</span>\
            </div>\
            <div class="sqs-row vendor-modal-details">';
    content += vendorData['l'] ? '<p><span><i class="fa fa-map-marker m-r-sm"></i><strong>Location:</strong> ' + vendorData['l'] + '</span></p>' : '';
    content += vendorData['c'] ? '<p><span><i class="fa fa-at m-r-sm"></i><strong>contact:</strong> ' + vendorData['c'] + '</span></p>' : '';
    content += vendorData['u'] ? '\
                <p><span><i class="fa fa-external-link-square-alt m-r-sm"></i><strong>Contact:</strong> \
                    <span class="vendor-modal-url"><a target="_blank" href="http://' + vendorData['u'] + '">' + vendorData['u'] + '</a></span>\
                </span></p>' : '';
    content += '\
                <p><span><i class="fa fa-cogs m-r-xs"></i><strong>Techonlogies:</strong> ' + vendorTechs + '</span></p>\
                <p><span><i class="fa fa-globe m-r-xs"></i><strong>Availability:</strong> ' + vendorGeos + '</span></p>\
            </div>\
        </div>';
    myModal.setTitle(title).setContent(content).open();
    customGA('send', 'event', 'vendor', 'details', vendorData['n']);
}

function filterWasClicked(e) {
    e.preventDefault();
    toggleFilterBox($(this).parent());
    refreshUI();
}

function toggleFilterBox(filterBoxElement) {
    filterBoxElement.find(".choices-box").toggleClass("hidden", 1000);
    filterBoxElement.find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-right");
}

function choiceWasClicked(e) {
    e.preventDefault();

    var title = $(this).find(".title").text();
    var step = $(this).attr("data-step");

    var choiceId = $(this).attr("data-choice-id");
    setFilteringStep(step, choiceId.toString());
    refreshUI();
}

function showCurrentFilterStep(step, titles) {
    var titleElement = $(".selected-filter-" + step).find("span");
    titleElement.html("");
    if (!isFilterStepEmpty(step)) {
        for (var title of titles) {
            if (titleElement.html()) {
                titleElement.html(titleElement.html() + ", ");
            }
            titleElement.html(titleElement.html() + title);
        }
        $(".selected-filter-" + step).removeClass("hidden");
    } else {
        $(".selected-filter-" + step).addClass("hidden");
    }
}

function clearFilterWasClicked(e) {
    e.preventDefault();
    var step = $(this).attr("data-step");
    clearFilterStep(step);
    $(this).toggleClass("hidden");
    $(".selected-filter-" + step).find("span").html("");
    refreshUI();
}

function scrollToTableHeader() {
    $('html, body').animate({
        scrollTop: $("#page").offset().top
    }, 500);
}

function showSpinner(element) {
    element.html("<div class='center'><i class='fa fa-spin fa-refresh fa-3x'></i></div>");
}

function addClickListenerToFilters() {
    $(".filter-title-box").off('click').click(filterWasClicked);
}

function addClickListenerToChoices() {
    $(".choice").off('click').click(choiceWasClicked);
}

function addClickListenerToFiltersClean() {
    $(".selected-filter").off('click').click(clearFilterWasClicked);
}

function addClickListenerToVendorRows() {
    $(".new-vendor").off('click').click(vendorWasClicked);
}

function addClickListenerToChatbotHeader() {
    $(".chatbot-header").off('click').click(function(e) {
        if (isChatbotVisible()) {
            hideChatbot();
            customGA('send', 'event', 'chatbot', 'click', 'hide');
        } else {
            showChatbot();
            customGA('send', 'event', 'chatbot', 'click', 'show');
        }
    });
}

var MINIMIZED = 'minimized';
var MAXIMIZED= 'maximized';
var CHATSTATE = 'chatbotstate';

function hideChatbot() {
    $(".chatbot-main").hide(400, function() {
        $(".chatbot-collapse-arrow").removeClass('fa-angle-down').addClass('fa-angle-up');
        $(".chatbot-title").show();
    });
    localStorage.setItem(CHATSTATE, MINIMIZED);
}

function showChatbot() {
    $(".chatbot-main").show(400, function() {
        $(".chatbot-collapse-arrow").addClass('fa-angle-down').removeClass('fa-angle-up');
        $(".chatbot-title").hide();
    });
    localStorage.setItem(CHATSTATE, MAXIMIZED);
}

function isChatbotVisible() {
    return $(".chatbot-collapse-arrow").hasClass('fa-angle-down');
}

function hideChatbotIfNeeded() {
    var height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    if (height < 1000) {
        hideChatbot();
    }

    if (localStorage.getItem(CHATSTATE) == MINIMIZED) {
        hideChatbot();
    }
}

$(document).ready(function() {
    addClickListenerToFilters();
    addClickListenerToChoices();
    addClickListenerToVendorRows();
    addClickListenerToFiltersClean();
    addClickListenerToChatbotHeader();

    hideChatbotIfNeeded();
    $(window).bind('resizeEnd', function() {
        hideChatbotIfNeeded();
    });
    attachVendorModal();
});

function refreshUI() {
    $(".custom-tooltip").hide();
    loadStep0();
    loadStep1();
    loadStep2();
    loadStep3();
    loadVendors();

    showNumberOfVendors();

    addClickListenerToChoices();
    addClickListenerToFiltersClean();
    addClickListenerToVendorRows();
    addClickListenerToChatbotHeader();

    attachTooltipPlugin();
    attachTooltipFeedback();
    attachVendorModal();
}

function showNumberOfVendors() {
    $(".vendors-number").html(": " + parseInt(vendorsToShow.length));
}

function attachTooltipPlugin() {
    new jBox('Tooltip', {
        attach: '.tooltip',
        width: 500,
        preventDefault: true,
        closeOnMouseleave: true,
        addClass: 'custom-tooltip',
        position: {
            x: 'right',
            y: 'center'
        },
        outside: 'x',
        delayOpen: 200
    });
}

function attachTooltipFeedback() {
    new jBox('Tooltip', {
        attach: '.tooltip-left',
        preventDefault: true,
        closeOnMouseleave: true,
        addClass: 'custom-tooltip',
        position: {
            x: 'left',
            y: 'center'
        },
        outside: 'x',
        adjustPosition: true,
        adjustTracker: true,
        delayOpen: 200
    });
}

var vendorModal;
function attachVendorModal() {
    myModal = $('.vendor').jBox('Modal', {
        maxWidth: 600
    });
}
