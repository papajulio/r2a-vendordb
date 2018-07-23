// Global variables containing JSON information
var jsonLoaded = false;
var objectives;
var personas;
var technologies;
var vendors;

// Global variables containing filtering
var filters = {
    0: [],
    1: [],
    2: [],
    3: []
};

function setFilteringStep(step, filter) {
    filter = filter.toString();
    var filterPosition = filters[step].indexOf(filter);
    if (filterPosition >= 0) {
        filters[step].splice(filterPosition, 1);
    } else {
        filters[step].push(filter);
    }
}

function clearFilterStep(step, filter) {
    if (filter == null) {
        filters[step] = [];
    } else {
        var filterPosition = filters[step].indexOf(filter);
        filters[step].pop(filterPosition);
    }
}

function isFilterStepEmpty(step) {
    return filters[step].length == 0;
}

function isFilterPresent(step, filter) {
    filter = filter.toString();
    return filters[step].indexOf(filter) >= 0;
}

var vendorsToShow = getVendorsToShow();

$.getJSON("db.json").done(function(json) {
    objectives = json.objectives;
    personas = json.personas;
    technologies = json.technologies;
    vendors = json.vendors;
    jsonLoaded = true;
    use_case = findGetParameter('use-case')
    if (use_case != null) {
        setFilteringStep(1, objectives[use_case]["n"].toString());
    }
    technology = findGetParameter('technology')
    if (technology != null) {
        setFilteringStep(2, technologies[use_case]["n"].toString());
    }
    country = findGetParameter('country')
    if (country != null) {
        var locations = getLocations();
        locationIdToSet = 0
        for (var locationId in locations) {
            if (locations[locationId] == country) {
                locationIdToSet = locationId
            }
        }
        setFilteringStep(3, locations[locationIdToSet].toString());
    }
    refreshUI();
});

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            parameter = item.split("=");
            if (parameter[0] === parameterName) {
                result = decodeURIComponent(parameter[1]);
            }
        });
    return result;
}

function loadStep0() {
    var targetElement = $(".choices-step-0");
    targetElement.html("");

    var selectedItems = [];
    var step = 0;
    var vendorCount = 0;
    for (var personaId in personas) {
        var rowSelectedClass = "";
        if (isFilterPresent(0, personas[personaId]["id"])) {
            rowSelectedClass = " choice-selected ";
            selectedItems.push(personas[personaId]["n"]);
        }
        vendorCount = getVendorCountIfChoiceSelected(0, personaId);
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + personaId + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><i class="fa fa-times m-r-sm"></i><span class="title">' + personas[personaId]["n"] + '</span></span>\
                <span title="Vendor number if filter is selected" class="custom-badge m-l-xs">' + vendorCount + '</span>\
            </div>'));
    }

    showCurrentFilterStep(0, selectedItems);
}

function loadStep1() {
    var targetElement = $(".choices-step-1");
    targetElement.html("");

    var step = 1;
    var selectedItems = [];
    var vendorCount = 0;
    for (var objectiveId in objectives) {
        var rowSelectedClass = "";
        if (isFilterPresent(1, objectives[objectiveId]["id"])) {
            rowSelectedClass = " choice-selected ";
            selectedItems.push(objectives[objectiveId]["n"]);
        }
        vendorCount = getVendorCountIfChoiceSelected(1, objectiveId);
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + objectiveId + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><i class="fa fa-times m-r-sm"></i></span>\
                <span class="title">' + objectives[objectiveId]["n"] + '</span>\
                <span title="Vendor number if filter is selected" class="custom-badge m-l-xs">' + vendorCount + '</span>\
                <i title="' + objectives[objectiveId]["d"] + '" class="fa fa-info-circle m-l-xs tooltip badge"></i>\
            </div>'));
    }

    showCurrentFilterStep(1, selectedItems);
}

function loadStep2() {
    var targetElement = $(".choices-step-2");
    targetElement.html("");

    var step = 2;
    var selectedItems = [];
    var vendorCount = 0;
    for (var technologyId in technologies) {
        var rowSelectedClass = "";
        if (isFilterPresent(2, technologies[technologyId]["id"])) {
            rowSelectedClass = " choice-selected ";
            selectedItems.push(technologies[technologyId]["n"]);
        }
        vendorCount = getVendorCountIfChoiceSelected(2, technologyId);
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + technologyId + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><i class="fa fa-times m-r-sm"></i><span class="title">' + technologies[technologyId]["n"] + '</span></span>\
                <span title="Vendor number if filter is selected" class="custom-badge m-l-xs">' + vendorCount + '</span>\
            </div>'));
    }

    showCurrentFilterStep(2, selectedItems);
}

function loadStep3() {
    var targetElement = $(".choices-step-3");
    var locations = getLocations();
    targetElement.html("");

    var step = 3;
    var selectedItems = [];
    var vendorCount = 0;
    for (var locationId in locations) {
        var rowSelectedClass = "";
        if (isFilterPresent(3, locations[locationId])) {
            rowSelectedClass = " choice-selected ";
            selectedItems.push(locations[locationId]);
        }
        vendorCount = getVendorCountIfChoiceSelected(3, locations[locationId]);
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + locations[locationId] + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><i class="fa fa-times m-r-sm"></i><span class="title">' + locations[locationId] + '</span></span>\
                <span title="Vendor number if filter is selected" class="custom-badge m-l-xs">' + vendorCount + '</span>\
            </div>'));
    }

    showCurrentFilterStep(3, selectedItems);
}

function getLocations() {
    var locations = [];
    for (var vendorId in vendors) {
        locations = mergeArrays(locations, vendors[parseInt(vendorId)]["g"]);
    }
    locations.sort();
    if (locations.indexOf("Global") != -1) {
        locations.splice(locations.indexOf("Global"), 1);
        locations.splice(0, 0, "Global");
    }
    return locations;
}

function loadVendors() {
    var targetElement = $(".vendors-list");
    targetElement.html("");

    vendorsToShow = getVendorsToShow();

    for (var vendorId in getVendorsToShow()) {
        targetElement.append($('\
            <div class="new-vendor" data-vendor-id="' + vendorsToShow[vendorId]["id"] + '">\
                <img class="vendor-image" src="' + vendorsToShow[vendorId]["lu"] + '" />\
            </div>'));
    }
}

function getVendorsToShow() {
    var result = [];
    for (var vendorId in vendors) {
        if (shouldShowVendor(vendors[vendorId], filters)) {
            result.push(vendors[vendorId]);
        }
    }
    return result;
}

function getVendorCountIfChoiceSelected(step, choice) {
    var new_filters = jQuery.extend(true, {}, filters);
    new_filters[step].push(choice);
    var count = 0;
    for (var vendorId in vendors) {
        count += shouldShowVendor(vendors[vendorId], new_filters) ? 1 : 0;
    }
    return count;
}

function shouldShowVendor(vendor, filters) {
    return step0ShouldShowVendor(vendor, filters)
        && step1ShouldShowVendor(vendor, filters)
        && step2ShouldShowVendor(vendor, filters)
        && step3ShouldShowVendor(vendor, filters);
}

function step0ShouldShowVendor(vendor, filters) {
    var stepFilters = filters[0];
    if (!stepFilters.length) {
        return true;
    }

    for (var stepFilter of stepFilters) {
        for (var objectiveId of personas[parseInt(stepFilter)].o) {
            if (vendor.o.indexOf(parseInt(objectiveId)) != -1) {
                return true;
            }
        }
    }

    return false;
}

function step1ShouldShowVendor(vendor, filters) {
    var stepFilters = filters[1];
    if (!stepFilters.length) {
        return true;
    }

    for (var stepFilter of stepFilters) {
        if (vendor.o.indexOf(parseInt(stepFilter)) != -1) {
            return true;
        }
    }

    return false;
}

function step2ShouldShowVendor(vendor, filters) {
    var stepFilters = filters[2];
    if (!stepFilters.length) {
        return true;
    }

    for (var stepFilter of stepFilters) {
        if (vendor.t.indexOf(parseInt(stepFilter)) != -1) {
            return true;
        }
    }

    return false;
}

function step3ShouldShowVendor(vendor, filters) {
    var stepFilters = filters[3];
    if (!stepFilters.length) {
        return true;
    }

    for (var stepFilter of stepFilters) {
        if (vendor.g.indexOf(stepFilter) != -1) {
            return true;
        }
    }

    return false;
}
