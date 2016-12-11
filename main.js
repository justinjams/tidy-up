var handleInput;

var assets = ['s', 'i', 'l', 'o', 't', 'arrow0', 'arrow1', 'arrow2', 'arrow3'];
window.IMAGES = [];

setTimeout(function () {
    var counter = assets.length;
    window.game = new Game();
    assets.forEach(function(e) {
        var image = new Image();
        image.src = 'img/' + e + '.png';
        image.onload = function () {
            if(!--counter) {
                game.start();
            }
        }
        IMAGES[e] = image;
    });

    handleInput = function(e) {
        var direction = {
            w: 0,
            d: 1,
            s: 2,
            a: 3,
            l: 4,
            k: 5,
            f: 6,
            r: 7
        }[String.fromCharCode(e.keyCode)];
        game.input(direction);
    };

    document.onkeypress = handleInput;
}, 0);