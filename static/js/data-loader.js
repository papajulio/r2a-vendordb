// Global variables containing JSON information
var jsonLoaded = false;
var objectives;
var personas;
var technologies;
var vendors;

// Global variables containing filtering
var filters = {
    0: "",
    1: "",
    2: "",
    3: ""
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
        setFilteringStep(1, objectives[use_case]["n"]);
        stepWasChanged(1, use_case)
    }
    technology = findGetParameter('technology')
    if (technology != null) {
        setFilteringStep(2, technologies[use_case]["n"]);
        stepWasChanged(2, technology)
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
        setFilteringStep(3, locations[locationIdToSet]);
        stepWasChanged(3, locations[locationIdToSet])
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

function stepWasChanged(step, choiceId) {
    step = parseInt(step);
    filters[step] = choiceId;
    vendorsToShow = getVendorsToShow();
    showNumberOfVendors();
}

function loadStep0() {
    var personaIdsToShow = getPersonaIdsFromVendors();
    var targetElement = $(".choices-step-0");
    targetElement.html("");
    var step = 0;

    for (var personaId of personaIdsToShow) {
        var rowSelectedClass = "";
        if (personas[personaId]["id"] == filters[0]) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + personaId + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><span class="title">' + personas[personaId]["n"] + '</span></span>\
            </div>'));
    }
}

function getPersonaIdsFromVendors() {
    vendorsToShow = getVendorsToShow();

    var objectiveIds = [];
    for (var vendorId in vendorsToShow) {
        objectiveIds = mergeArrays(objectiveIds, vendorsToShow[vendorId].o);
    }

    var result = [];
    for (var personaId in personas) {
        for (var personaObjective of personas[personaId].o) {
            if (objectiveIds.indexOf(personaObjective) != -1) {
                result = mergeArrays(result, [personaId]);
                break;
            }
        }
    }
    return result.sort();
}

function loadStep1() {
    var targetElement = $(".choices-step-1");
    var objectiveIdsToShow = getObjectiveIdsFromVendors();
    targetElement.html("");

    var step = 1;
    for (var objectiveId of objectiveIdsToShow) {
        var rowSelectedClass = "";
        if (objectives[objectiveId]["id"] == filters[1]) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + objectiveId + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><span class="title">' + objectives[objectiveId]["n"] + '</span>\
                <i class="fa fa-info-circle tooltip m-l-sm" title="' + objectives[objectiveId]["d"] + '"></i></span>\
            </div>'));
    }
}

function getObjectiveIdsFromVendors() {
    vendorsToShow = getVendorsToShow();

    var objectiveIds = [];
    for (var vendorId in vendorsToShow) {
        objectiveIds = mergeArrays(objectiveIds, vendorsToShow[vendorId].o);
    }
    return objectiveIds.sort();
}

function loadStep2() {
    var targetElement = $(".choices-step-2");
    var technologyIdsToShow = getTechonologyIdsFromVendors();
    targetElement.html("");

    var step = 2;
    for (var technologyId of technologyIdsToShow) {
        var rowSelectedClass = "";
        if (technologies[technologyId]["id"] == filters[2]) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + technologyId + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><span class="title">' + technologies[technologyId]["n"] + '</span></span>\
            </div>'));
    }
}

function getTechonologyIdsFromVendors() {
    vendorsToShow = getVendorsToShow();

    var technologyIds = [];
    for (var vendorId in vendorsToShow) {
        technologyIds = mergeArrays(technologyIds, vendorsToShow[vendorId].t);
    }
    return technologyIds.sort();
}

function loadStep3() {
    var targetElement = $(".choices-step-3");
    var locations = getLocations();
    targetElement.html("");

    var step = 3;
    for (var locationId in locations) {
        var rowSelectedClass = "";
        if (locations[locationId] == filters[3]) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="col sqs-col-12 choice' + rowSelectedClass + '" data-step="' + step + '" data-choice-id="' + locations[locationId] + '">\
                <span><i class="fa fa-angle-right m-r-sm"></i><span class="title">' + locations[locationId] + '</span></span>\
            </div>'));
    }
}

function getLocations() {
    vendorsToShow = getVendorsToShow();
    var locations = [];
    for (var vendorId in vendorsToShow) {
        locations = mergeArrays(locations, vendorsToShow[vendorId].g);
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
            <div class="main-row row sqs-row vendor-row vendor" data-vendor-id="' + vendorsToShow[vendorId]["id"] + '">\
                <div class="vtile col sqs-col-1-0-0 span-1-0-0">\
                    <div class="vlogo col sqs-col-1-5 span-1-5">\
                        <img src="' + vendorsToShow[vendorId]["lu"] + '" />\
                    </div>\
                    <div class="col sqs-col-8-5 span-8-5 vcontent">\
                        <h4 id="vname">' + vendorsToShow[vendorId]["n"] + '</h4>\
                        <p class="location">' + vendorsToShow[vendorId]["l"] + '<a class="vendor-url" href="http://' + vendorsToShow[vendorId]["u"] + '">' + vendorsToShow[vendorId]["u"] + '</a></p>\
                        <p id="vdesc">' + trimText(vendorsToShow[vendorId]["d"], 180) + '</p>\
                    </div>\
                </div>\
            </div>'));
    }
}

function getVendorsToShow() {
    var result = [];
    for (var vendorId in vendors) {
        if (shouldShowVendor(vendors[vendorId])) {
            result.push(vendors[vendorId]);
        }
    }
    return result;
}

function shouldShowVendor(vendor) {
    return step0ShouldShowVendor(vendor)
        && step1ShouldShowVendor(vendor)
        && step2ShouldShowVendor(vendor)
        && step3ShouldShowVendor(vendor);
}

function step0ShouldShowVendor(vendor) {
    var stepFilter = filters[0];
    if (stepFilter == "") {
        return true;
    }

    for (var objectiveId of personas[parseInt(stepFilter)].o) {
        if (vendor.o.indexOf(parseInt(objectiveId)) != -1) {
            return true;
        }
    }

    return false;
}

function step1ShouldShowVendor(vendor) {
    var stepFilter = filters[1];
    if (stepFilter == "") {
        return true;
    }

    if (vendor.o.indexOf(parseInt(stepFilter)) != -1) {
        return true;
    }

    return false;
}

function step2ShouldShowVendor(vendor) {
    var stepFilter = filters[2];
    if (stepFilter == "") {
        return true;
    }

    if (vendor.t.indexOf(parseInt(stepFilter)) != -1) {
        return true;
    }

    return false;
}

function step3ShouldShowVendor(vendor) {
    var stepFilter = filters[3];
    if (stepFilter == "") {
        return true;
    }

    if (vendor.g.indexOf(stepFilter) != -1) {
        return true;
    }

    return false;
}
