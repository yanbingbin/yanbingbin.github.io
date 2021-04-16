// 参考链接：https://segmentfault.com/a/1190000023157856
// Promise.resolve
// Promise.reject
// Promise.all
// Promise.race
// Promise.allSettled
// Promise.prototype.catch
// Promise.prototype.finally
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';

const REJECTED = 'REJECTED';
class Promise {
    static resolve(value) {
        return new Promise(resolve => resolve(value));
    }
    static reject(reason) {
        return new Promise((resolve, reject) => reject(reason));
    }
    static all(promises) {
        return new Promise((resolve, reject) => {
            let res = [];
            let count = 0;
            const len = promises.length;
            for (let i = 0; i < len; i++) {
                const promise = promises[i];
                promise.then(value => {
                    res[i] = value;
                    if (++count === len) {
                        resolve(res);
                    }
                }, reject)
            }
        });
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(resolve, reject)
            })
        });
    }
    static allSettled(promises) {
        return new Promise(resolve => {
            let count = 0;
            let res = [];
            const callback = (value, index) => {
                res[index] = value;
                if (++count === promises.length) {
                    resolve(res);
                }
            }
            promises.forEach((promise, index) => {
                promise.then(value => {
                    callback(value, index);
                }, reason => {
                    callback(reason, index);
                })
            });
        });
    }
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallback = [];
        this.onRejectedCallback = [];
        const resolve = (value) => {
            if (value instanceof Promise) {
                return value.then(resolve, reject); // 如果 value 是个 Promise，递归执行
            }
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED;
                this.onResolvedCallback.forEach(fn => fn());
            }
        };
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallback.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else if (this.status === PENDING) {
                this.onResolvedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                })
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                })
            }
        })
        return promise2;
    }
    catch(errCallback) {
        return this.then(null, errCallback);
    }
    finally(callback) {
        return this.then(
            value => Promise.resolve(callback()).then(() => value),
            reason => Promise.resolve(callback()).then(() => { throw reason })
        )
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let called = false;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, e => {
                    if (called) return;
                    called = true;
                    reject(e);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

// 中断promise 利用 race 返回最先执行的 promise 结果
let p1 = new Promise((resolve, reject) => {
    // setTimeout(() => {
    reject(2);
        resolve(1);
    // }, 1000)
});
p1.then(res => {
    console.log('res: ', res);
}).then(res => {
    console.log('res: ', res);
}).catch(err => {
    console.log('err: ', err);
});
// 这里我要中断p1
// function wrap(p1) {
//     let abort;
//     let p = new Promise((resolve, reject) => {
//         abort = reject;
//     });
//     let p2 = Promise.race([p1, p]);
//     p2.abort = abort;
//     return p2;
// }
// let p2 = wrap(p1);
// p2.then(data => {
//     console.log('data: ', data);
// }, err => {
//     console.log('err: ', err);
// })
// setTimeout(() => {
//     p2.abort('错误信息');
// }, 100)

module.exports = Promise;