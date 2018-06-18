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
});

function stepWasChanged(step, choiceId) {
    step = parseInt(step);
    filters[step] = choiceId;
    vendorsToShow = getVendorsToShow();
    showNumberOfVendors();
}

function loadStep0(targetElement, selectedItemTitle) {
    var personaIdsToShow = getPersonaIdsFromVendors();
    targetElement.html("");
    var step = 0;
    for (var personaId of personaIdsToShow) {
        var rowSelectedClass = "";
        if (personas[personaId]["n"] == selectedItemTitle) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="main-row row sqs-row">\
                <div class="col sqs-col-12 span-12">\
                    <div class="row sqs-row">\
                        <div class="choices-row ' + rowSelectedClass + 'col sqs-col-12 span-12" data-step="' + step + '" data-choice-id="' + personaId + '">\
                            <h3>' + personas[personaId]["n"] + '</h3>\
                        </div>\
                    </div>\
                </div>\
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

function loadStep1(targetElement, selectedItemTitle) {

    var objectiveIdsToShow = getObjectiveIdsFromVendors();
    targetElement.html("");

    var step = 1;
    for (var objectiveId of objectiveIdsToShow) {
        var rowSelectedClass = "";
        if (objectives[objectiveId]["n"] == selectedItemTitle) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="main-row row sqs-row objective">\
                <div class="col sqs-col-12 span-12">\
                    <div class="row sqs-row">\
                        <div class="choices-row ' + rowSelectedClass + 'col sqs-col-12 span-12" data-step="' + step + '" data-choice-id="' + objectiveId + '">\
                            <h3>' + objectives[objectiveId]["n"] + '</h3>\
                            <p class="use_case clear">' + objectives[objectiveId]["d"] + '</p>\
                        </div>\
                    </div>\
                </div>\
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

function loadStep2(targetElement, selectedItemTitle) {
    var technologyIdsToShow = getTechonologyIdsFromVendors();
    targetElement.html("");

    var step = 2;
    for (var technologyId of technologyIdsToShow) {
        var rowSelectedClass = "";
        if (technologies[technologyId]["n"] == selectedItemTitle) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="main-row row sqs-row objective">\
                <div class="col sqs-col-12 span-12">\
                    <div class="row sqs-row">\
                        <div class="choices-row ' + rowSelectedClass + 'col sqs-col-12 span-12" data-step="' + step + '" data-choice-id="' + technologyId + '">\
                            <h3>' + technologies[technologyId]["n"] + '</h3>\
                        </div>\
                    </div>\
                </div>\
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

function loadStep3(targetElement, selectedItemTitle) {
    var locations = getLocations();
    targetElement.html("");

    var step = 3;
    for (var locationId in locations) {
        var rowSelectedClass = "";
        if (locations[locationId] == selectedItemTitle) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="main-row row sqs-row location">\
                <div class="col sqs-col-12 span-12">\
                    <div class="row sqs-row">\
                        <div class="choices-row ' + rowSelectedClass + 'col sqs-col-12 span-12" data-step="' + step + '" data-choice-id="' + locations[locationId] + '">\
                            <h3>' + locations[locationId] + '</h3>\
                        </div>\
                    </div>\
                </div>\
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

function loadVendors(targetElement, selectedItemTitle) {
    var step = 4;

    targetElement.html("");

    vendorsToShow = getVendorsToShow();

    for (var vendorId in getVendorsToShow()) {
        var rowSelectedClass = "";
        if (vendorsToShow[vendorId]["n"] == selectedItemTitle) {
            rowSelectedClass = " choice-selected ";
        }

        targetElement.append($('\
            <div class="main-row row sqs-row vendor-row">\
                <div class="vtile col sqs-col-1-0-0 span-1-0-0">\
                    <div class="vlogo col sqs-col-1-5 span-1-5">\
                        <img src="' + vendorsToShow[vendorId]["lu"] + '" />\
                    </div>\
                    <div class="col sqs-col-8-5 span-8-5 vcontent">\
                        <h4 id="vname">' + vendorsToShow[vendorId]["n"] + '</h4>\
                        <p class="location">' + vendorsToShow[vendorId]["l"] + '</p>\
                        <p id="vdesc">' + trimText(vendorsToShow[vendorId]["d"], 180) + '</p>\
                        <p id="vurl">' + vendorsToShow[vendorId]["u"] + '</p>\
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
