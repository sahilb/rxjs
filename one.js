var log = console.log.bind(console);
var x = document.querySelector('div');

var clicks = Rx.Observable.fromEvent(document, 'mousedown');

var doubleClicks = clicks.bufferTime(500).filter(x => x.length > 1);

var getManifest = () => {
    return Rx.Observable.create(observer => {
        let timerId = setTimeout(() => {
            observer.next('manifest');
            observer.complete();
        }, 2000);
        return () => {
            log('unsubscribing manifest ');
            clearTimeout(timerId);
        };
    });
};

var getLicense = (manifest) => {
    return Rx.Observable.create(observer => {
    	log('getting license....');
        let timerId = setTimeout(() => {
            observer.next('license');
            observer.complete();
        }, 3000);
        return () => {
            log('unsubscribing license ');
            clearTimeout(timerId);
        };
    })
};
var identityWithLog = (x) =>{
	log(x);
	return Rx.Observable.of(x);
} 

var authorize = getManifest().flatMap(getManifest).flatMap(identityWithLog).flatMap(getLicense).flatMap(identityWithLog);
let errorHandler = console.error.bind(console);
let subscription = authorize.subscribe((data) => {
    log('Authorize completed ', data);
});
