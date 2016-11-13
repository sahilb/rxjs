var log = console.log.bind(console);
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var Stars = createEntities(canvas.width, canvas.height, 100, 4);
var Enemies = createEntities(canvas.width, canvas.height, 5, 12);

function createEntities(magnitudeX, magnitudeY, count, size) {
    var stars;
    Rx.Observable.range(0, count)
        .toArray()
        .subscribe(arr => {
            stars = arr.map(x => {
                return {
                    x: ((Math.random() * 10000) | 0) % (magnitudeX - size),
                    y: ((Math.random() * 10000) | 0) % (magnitudeY - size),
                    size: size > 10 ? size : (1 + (Math.random() * size))
                };
            });
        });
    return stars
}

function drawTriangle(x, y, width, color, direction) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up'? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width, y);
    ctx.fill();
}

function render() {
	log('rendering');
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    
    Enemies.forEach(enemy => {
        drawTriangle(enemy.x, enemy.y, enemy.size, '#FF0000', 'down');
    });
    ctx.fillStyle = "#F1F1F1";
    Stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

var stars = Rx.Observable.interval(1500).map(() => {
	log('stars ')
    Stars.forEach((star) => {
        if (star.y + 20 >= canvas.height) {
            star.y = 5;
            star.x = ((Math.random() * 10000) | 0) % (canvas.width - 10);
        } else {
            star.y += 15;
        }
    });
});

var enemies = Rx.Observable.interval(700).map(() => {
	log('enemies');
    Enemies.forEach(enemy => {
        if (enemy.y + 50 >= canvas.height) {
            enemy.y = 20;
            enemy.x = ((Math.random() * 10000) | 0) % (canvas.width - enemy.size);
        }
        enemy.y = enemy.y + 10;
    })
});

Rx.Observable.merge(stars, enemies).subscribe(render);



// star stream that gives a series of stars
// spaceship stream that gives spaceship and position
// enemies stream that gives enemies positions
