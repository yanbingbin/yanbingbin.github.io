const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        const resolve = (value) => {
            this.value = value;
            this.status = FULFILLED;
        };
        const reject = (reason) => {
            this.reason = reason;
            this.status = REJECTED;
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        } else if (this.status === REJECTED) {
            onRejected(this.reason);
        }
    }
}