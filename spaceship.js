var log = console.log.bind(console);
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var Stars 	= createEntities(200, 4, '#F1F1F1');
var Enemies = createEntities(15, 12, '#FF6666');
var SuperEnemies = createEntities(1, 20, '#FF0000');
var SpaceShip = newEntity(12, '#00FF00');
SpaceShip.x = canvas.width/2;
SpaceShip.y = canvas.height - 40;

function newEntity(size, color){
	return {
		x: ((Math.random() * 10000) | 0) % (canvas.width - size - 5),
		y: ((Math.random() * 10000) | 0) % (canvas.height - size - 5),
		size: size > 10 ? size : (1 + (Math.random() * size)),
		color: color
	}
}
function createEntities(count, size, color) {
    var stars;
    Rx.Observable.range(0, count)
        .toArray()
        .subscribe(arr => {
            stars = arr.map( () => newEntity(size, color));
        });
    return stars;
}

function drawTriangle(x, y, width, color, direction) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width, y);
    ctx.fill();
}

function createStream(entities, displacement, interval) {
    return Rx.Observable
        .interval(interval)
        .flatMap(() => {
            newEntities = entities.map(entity => {
                if (entity.y + displacement + entity.size >= canvas.height) {
                    entity.y = entity.size;
                    entity.x = ((Math.random() * 10000) | 0) % (canvas.width - entity.size);
                } else {
                    entity.y += displacement;
                }
                return entity;
            });
            return Rx.Observable.of(newEntities);
        })
}

var stars 			= createStream(Stars, 5, 1500);
var enemies 		= createStream(Enemies, 15, 800);
var superEnemies 	= createStream(SuperEnemies, 30, 200);
var spaceShips  	= Rx.Observable.of(SpaceShip).merge(Rx.Observable.fromEvent(document, 'keydown'))
	.map((ev)=> (ev.color ||  ev.key === 'ArrowRight' ? 10 : (ev.key === 'ArrowLeft' ? -10 : 0) ))
	.filter(delta => delta !== 0)
	.flatMap(delta => {
		if( SpaceShip.x + delta + 30 > canvas.width){
			// do nothing, crossing right
		}else if (SpaceShip.x + delta - 30 < 0 ){
			// do nothing, crossing left
		}else {
			SpaceShip.x += delta;
		}
		return Rx.Observable.of(SpaceShip);
	});


var rendering = Rx.Observable.combineLatest(stars, enemies, superEnemies, spaceShips).subscribe(render);

function render(...args) {
    let [st, en, superEn, spaceShip] = args[0];
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    st.forEach(star => {
        ctx.fillStyle = star.color;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    en.forEach(entity => {
        drawTriangle(entity.x, entity.y, entity.size, entity.color, 'down');
    });

    superEn.forEach(entity => {
        drawTriangle(entity.x, entity.y, entity.size, entity.color, 'down');
    });

	drawTriangle(spaceShip.x, spaceShip.y, spaceShip.size, spaceShip.color, 'up');

}