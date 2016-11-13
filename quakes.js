var log = console.log.bind(console);
var clicks = Rx.Observable.fromEvent(document, 'mousedown');
var doubleClicks = clicks.bufferTime(500).filter(x => x.length > 1).map( events => events[0]);

var quakes = Rx.Observable.create(function(observer) {
  window.eqfeed_callback = function(response) {
    var quakes = response.features;
    quakes.forEach(function(quake) {
      observer.next(quake);
    });
  };

  loadJSONP(QUAKE_URL);
});

var greaterThan = (x) => (q) => q.properties.mag > x;

quakes
    .filter(greaterThan(1.5))
    .subscribe((quake) => {
        let coords = quake.geometry.coordinates,
            size = quake.properties.mag * 10000;
        L.circle([coords[1], coords[0]], size).addTo(map);
    });


Rx.Observable.interval(5000)
    .flatMap(x => quakes)
    .filter(greaterThan(4))
    .map(q => q.properties.title)
    .distinct()
    .subscribe(log)
