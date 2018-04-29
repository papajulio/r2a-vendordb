function customGA() {
    if (isDevelopmentEnviroment()) {
        console.log('Developer mode GA:')
        console.log(arguments);
        return;
    }
    console.log('sending ga');
    ga.apply(null, arguments);
}

function isDevelopmentEnviroment() {
    return window.location.href.indexOf("localhost") > -1;
}
