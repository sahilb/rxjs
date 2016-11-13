var log = console.log.bind(console);
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var Stars = createStars(canvas.width, canvas.height);

function createStars(magnitudeX, magnitudeY) {
    var stars = [];
    Rx.Observable.range(1, 50)
        .subscribe(x => {
            stars[x] = {
                x: ((Math.random() * 10000) | 0) % (magnitudeX - 5),
                y: ((Math.random() * 10000) | 0) % (magnitudeY - 5)
            };
        });
    return stars
}

function render() {
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#F1F1F1";
    Stars.forEach(star => {
        ctx.fillRect(star.x, star.y, 3, 3);
        //drawStar(star.x, star.y, 3, 30, 30);
    });
}

var stars = Rx.Observable.interval(700).take(40).map(() => {
        Stars.forEach((star) => {
            if (star.y + 20 >= canvas.height) {
                star.y = 5;
                star.x = ((Math.random() * 10000) | 0) % (canvas.width - 10);
            } else {
                star.y += 15;
            }
        })
        render();
    })
stars.subscribe(render);



