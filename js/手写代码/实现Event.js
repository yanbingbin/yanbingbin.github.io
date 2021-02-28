class EventEmitter {
    constructor() {
        this._events = new Map();
    }
    on(eventName, fn) {
        let handler = this._events.get(eventName);
        if (!handler) {
            this._events.set(eventName, [fn])
        } else {
            handler.push(fn);
        }
        return this;
    }
    off(eventName, fn) {
        let handler = this._events.get(eventName);
        if (Array.isArray(handler)) {
            if (fn) {
                let index = handler.indexOf(fn);
                if (index !== -1) {
                    handler.splice(index, 1);
                }
            } else {
                handler.length = 0;
            }
        }
        return this;
    }
    emit(eventName, ...args) {
        let handler = this._events.get(eventName);
        if (Array.isArray(handler)) {
            handler.forEach(fn => {
                fn(...args);
            })
        }
        return this;
    }
}

const ev = new EventEmitter();
const fn = (a) => {
    console.log('test :>> ', a);
}
ev.on('test', fn)
ev.on('test', (a) => {
    console.log('testsss :>> ', a);
})
ev.off('test', fn)
ev.emit('test', 222)