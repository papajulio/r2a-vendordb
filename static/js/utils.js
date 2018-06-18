function customGA() {
    if (isDevelopmentEnviroment()) {
        console.log('Developer mode GA:')
        console.log(arguments);
        return;
    }
    ga.apply(null, arguments);
}

function isDevelopmentEnviroment() {
    return window.location.href.indexOf("localhost") > -1;
}

function shuffle(array) {
    var currentIndex = array.length;
    while (currentIndex > 0) {
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        swapValues(array, currentIndex, randomIndex);
    }
    return array;
}

function swapValues(array, currentIndex, randomIndex) {
    var temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
}

function mergeArrays(array1, array2) {
    return arrayUnique(array1.concat(array2));
}

function arrayUnique(array) {
    var result = array.concat();
    for(var i = 0; i < result.length; ++i) {
        for(var j = i + 1; j < result.length; ++j) {
            if(result[i] === result[j])
                result.splice(j--, 1);
        }
    }

    return result;
}

function trimText(text, maxSize) {
    if (text.length > maxSize) {
        return text.substring(0, maxSize - 3)  + "...";
    }
    return text;
}
