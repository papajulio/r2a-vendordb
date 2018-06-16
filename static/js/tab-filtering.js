var loaderFunction = {
    0: loadStep0,
    1: loadStep1,
    2: loadStep2,
    3: loadStep3,
    4: loadVendors
};

function tabWasActivated(event, tab) {
    var selectedStep = tab.tab.attr("data-step");
    var targetElement = tab.panel.find(".list-container");
    var selectedItemTitle = tab.tab.find(".filter-selected").attr("data-filter");
    loadStepContent(selectedStep, targetElement, selectedItemTitle);
}

function choiceWasClicked(e) {
    e.preventDefault();
    var step = $(this).attr("data-step");
    var choiceId = $(this).attr("data-choice-id");
    var title = $(this).find("h3").text();
    $(this).addClass("choice-selected");
    setFilteringStep(step, title);
    stepWasChanged(step, choiceId);
    activateNextStep(step);
    scrollToTableHeader();
}

function scrollToTableHeader() {
    $('html, body').animate({
        scrollTop: $("#postHeader").offset().top
    }, 500);
}

function addClickListenerToClearFilter() {
    $(".clear-filter-icon").off('click').click(clearFilteringStep);
}

function clearFilteringStep(e) {
    e.preventDefault();
    var step = $(this).attr("data-step");
    var tab = $("#vendorFilters").find("li[data-step=" + step + "]");
    var accordionTab = $(".r-tabs-accordion-title.r-tabs-state-active");

    stepWasChanged(step, "");

    $(tab.find("a").attr("href")).find(".choice-selected").each(function (){
        $(this).removeClass("choice-selected");
    })

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
}

function activateNextStep(step) {
    var nextStep = parseInt(step) + 1;
    $("#vendorFilters").responsiveTabs("activate", nextStep);
}

function loadStepContent(selectedStep, targetElement, selectedItemTitle) {
    showSpinner(targetElement);
    if (loaderFunction[selectedStep]) {
        loaderFunction[selectedStep](targetElement, selectedItemTitle);
    }
    addClickListenerToChoicesRow();
}

function showSpinner(element) {
    element.html("<div class='center'><i class='fa fa-spin fa-refresh fa-3x'></i></div>");
}

function addClickListenerToChoicesRow() {
    $(".choices-row").off('click').click(choiceWasClicked);
}

$(document).ready(function() {
    $("#vendorFilters").responsiveTabs({
        activate: tabWasActivated,
        startCollapsed: 'accordion'
    });

    addClickListenerToChoicesRow();
    addClickListenerToClearFilter();
    refreshUI();
});

function refreshUI() {
    showNumberOfVendors();
}

function showNumberOfVendors() {
    $(".vendors-number").html(": " + parseInt(vendorsToShow.length));
}
