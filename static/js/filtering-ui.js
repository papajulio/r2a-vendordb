function vendorWasClicked(e) {
    var vendorId = $(this).attr("data-vendor-id");
    console.log("Vendor was clicked: " + vendorId);
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
    $(".selected-filter-" + step).find("span").html(title);
    $(".selected-filter-" + step).removeClass("hidden");

    var choiceId = $(this).attr("data-choice-id");
    setFilteringStep(step, choiceId);
    refreshUI();
}

function clearFilterWasClicked(e) {
    e.preventDefault();
    var step = $(this).attr("data-step");
    filters[step] = "";
    $(this).toggleClass("hidden");
    refreshUI();
}

function scrollToTableHeader() {
    $('html, body').animate({
        scrollTop: $("#page").offset().top
    }, 500);
}

function setFilteringStep(step, filter) {
    if (filters[step] == filter) {
        $(".selected-filter-" + step).addClass("hidden");
        filters[step] = "";
    } else {
        filters[step] = filter;
    }
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
    $(".vendor-row").off('click').click(vendorWasClicked);
}

$(document).ready(function() {
    refreshUI();
    addClickListenerToFilters();
    addClickListenerToChoices();
    addClickListenerToVendorRows();
    addClickListenerToFiltersClean();
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

function showNumberOfVendors() {
    $(".vendors-number").html(": " + parseInt(vendorsToShow.length));
}
