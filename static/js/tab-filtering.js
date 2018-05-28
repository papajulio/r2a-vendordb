function tabWasClicked(event, tab) {
    var loaderFunction = {
        0: loadStep1
    };

    var selectedStep = tab.tab.attr("data-step");
    var targetElement = tab.panel.find(".list-container");

    showSpinner(targetElement);

    if (loaderFunction[selectedStep]) {
        loaderFunction[selectedStep](targetElement);
    }
    addClickListenerToChoicesRow();
}

function showSpinner(element) {
    element.html("<div class='center'><i class='fa fa-spin fa-refresh fa-3x'></i></div>");
}

function loadStep1(targetElement) {
    targetElement.html("");
    targetElement.append($('\
        <div class="main-row row sqs-row objective" data-objective-id="0" data-categories="vaca">\
            <div class="col sqs-col-12 span-12">\
                <div class="row sqs-row">\
                    <div class="choices-row col sqs-col-12 span-12" data-step="0">\
                        <h3>I really have super cow powers</h3>\
                        <ul class="tags"><li>One of those objectives</li></ul>\
                        <p class="use_case clear">Manage queries on new regulations with a chatbot</p>\
                    </div>\
                </div>\
            </div>\
        </div>'));
}

function addClickListenerToChoicesRow() {
    $(".choices-row").off('click').click(choiceWasClicked);
}

function choiceWasClicked(e) {
    e.preventDefault();
    var step = $(this).attr("data-step");
    var title = $(this).find("h3").text();
    setFilteringStep(step, title);
}

function addClickListenerToClearFilter() {
    $(".clear-filter-icon").off('click').click(clearFilteringStep);
}

function clearFilteringStep(e) {
    e.preventDefault();
    var step = $(this).attr("data-step");
    var tab = $("#vendorFilters").find("li[data-step=" + step + "]");
    var accordionTab = $(".r-tabs-accordion-title.r-tabs-state-active");

    tab.find(".filter-icon").addClass("hidden");
    accordionTab.find(".filter-icon").addClass("hidden");

    tab.find(".filter-selected").attr("data-filter", "");
    accordionTab.find(".filter-selected").attr("data-filter", "");

    tab.find(".filter-selected").text("");
    accordionTab.find(".filter-selected").text("");

    tab.find(".filter-selected").addClass("hidden");
    accordionTab.find(".filter-selected").addClass("hidden");

    tab.find(".clear-filter-icon").addClass("hidden");
    accordionTab.find(".clear-filter-icon").addClass("hidden");
}

function setFilteringStep(step, filter) {
    const FILTER_MAX_LENGTH = 20;

    var tab = $("#vendorFilters").find("li[data-step=" + step + "]");
    var accordionTab = $(".r-tabs-accordion-title.r-tabs-state-active");

    tab.find(".filter-icon").removeClass("hidden");
    accordionTab.find(".filter-icon").removeClass("hidden");

    tab.find(".filter-selected").attr("data-filter", filter);
    accordionTab.find(".filter-selected").attr("data-filter", filter);

    tab.find(".filter-selected").text(filter.substring(0, FILTER_MAX_LENGTH - 3) + "...");
    accordionTab.find(".filter-selected").text(filter);

    tab.find(".filter-selected").removeClass("hidden");
    accordionTab.find(".filter-selected").removeClass("hidden");

    tab.find(".clear-filter-icon").removeClass("hidden");
    accordionTab.find(".clear-filter-icon").removeClass("hidden");

    activateNextStep(step);
}

function activateNextStep(step) {
    $("#vendorFilters").responsiveTabs("activate", parseInt(step) + 1)
}

$(document).ready(function() {
    $("#vendorFilters").responsiveTabs({
        activate: tabWasClicked,
        startCollapsed: 'accordion'
    });

    addClickListenerToChoicesRow();
    addClickListenerToClearFilter();
});
