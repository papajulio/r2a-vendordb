function tabWasClicked(event, tab) {
    var loaderFunction = {
        0: loadStep0,
        1: loadStep1,
        2: loadStep2,
        3: loadStep3
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

    var trimmedFilter = filter;
    if (filter.length >= FILTER_MAX_LENGTH) {
        trimmedFilter = filter.substring(0, FILTER_MAX_LENGTH - 3) + "...";
    }
    tab.find(".filter-selected").text(trimmedFilter);
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
