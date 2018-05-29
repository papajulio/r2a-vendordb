function loadStep0(targetElement, selectedItemTitle) {
    loadDemoStep(targetElement, 0, selectedItemTitle);
}

function loadStep1(targetElement, selectedItemTitle) {
    loadDemoStep(targetElement, 1, selectedItemTitle);
}

function loadStep2(targetElement, selectedItemTitle) {
    loadDemoStep(targetElement, 2, selectedItemTitle);
}

function loadStep3(targetElement, selectedItemTitle) {
    loadDemoStep(targetElement, 3, selectedItemTitle);
}

function loadDemoStep(targetElement, step, selectedItemTitle) {
    targetElement.html("");
    var titleElements = [
        "Dapper Drake",
        "Hardy Heron",
        "Lucid Lynx",
        "Precise Pangolin",
        "Trusty Tahr",
        "Xenial Xerus",
        "Bionic Beaver"
    ];
    titleElements = shuffle(titleElements);
    for (var title of titleElements) {
        var rowSelectedClass = "";
        if (title == selectedItemTitle) {
            rowSelectedClass = " choice-selected ";
        }
        targetElement.append($('\
            <div class="main-row row sqs-row objective" data-objective-id="0" data-categories="vaca">\
                <div class="col sqs-col-12 span-12">\
                    <div class="row sqs-row">\
                        <div class="choices-row ' + rowSelectedClass + 'col sqs-col-12 span-12" data-step="' + step + '">\
                            <h3>' + title + '</h3>\
                            <ul class="tags"><li>One of those objectives</li></ul>\
                            <p class="use_case clear">Manage queries on new regulations with a chatbot</p>\
                        </div>\
                    </div>\
                </div>\
            </div>'));
    }
}
