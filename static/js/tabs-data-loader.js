function loadStep0(targetElement) {
    loadDemoStep(targetElement, 0);
}

function loadStep1(targetElement) {
    loadDemoStep(targetElement, 1);
}

function loadStep2(targetElement) {
    loadDemoStep(targetElement, 2);
}

function loadStep3(targetElement) {
    loadDemoStep(targetElement, 3);
}

function loadDemoStep(targetElement, step) {
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
        targetElement.append($('\
            <div class="main-row row sqs-row objective" data-objective-id="0" data-categories="vaca">\
                <div class="col sqs-col-12 span-12">\
                    <div class="row sqs-row">\
                        <div class="choices-row col sqs-col-12 span-12" data-step="' + step + '">\
                            <h3>' + title + '</h3>\
                            <ul class="tags"><li>One of those objectives</li></ul>\
                            <p class="use_case clear">Manage queries on new regulations with a chatbot</p>\
                        </div>\
                    </div>\
                </div>\
            </div>'));
    }
}
