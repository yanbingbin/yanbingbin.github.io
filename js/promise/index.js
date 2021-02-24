// Promise 是一个类，类的构造函数需要传入一个执行器 executor
// executor两个参数: resolve reject
// 默认创建一个 promise 状态由三个：pending fulfilled rejected 
// 调用成功或失败时，需要传递一个成功原因或失败原因
// 如果状态转变成 resolved 或者 rejected 状态后，状态不能再次变化
// Promise的实例都有一个 then 方法, 可以调用多次，返回一个 Promise 对象
// 抛出异常按照失败处理
const status = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) { // 避免循环引用
        return reject(new TypeError('Error'));
    }
    // 判断x的类型，如果x是对象或者函数，说明x有可能是一个promise，否则就不可能是promise
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let called = false; // promise的实现可能有多个，但都要遵循promise a+规范，我们自己写的这个promise用不上called,但是为了遵循规范才加上这个控制的，因为别人写的promise可能会有多次调用的情况。
        try {
            // 因为then方法有可能是getter来定义的, 取then时有风险，所以要放在try...catch...中
			// 别人写的promise可能是这样的
			// Object.defineProperty(promise, 'then', {
			// 	get() {
			// 		throw new Error();
			// 	}
			// })
            let then = x.then;
            if (typeof then === 'function') {
                // x.then(()=>{}, ()=>{}); 不要这么写，以防以下写法造成报错， 而且也可以防止多次取值
				// let obj = {
				// 	a: 1,
				// 	get then() {
				// 		if (this.a++ == 2) {
				// 			throw new Error();
				// 		}
				// 		console.log(1);
				// 	}
				// }
				// obj.then;
				// obj.then
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject); // 当前promise解析出来的结果可能还是一个promise, 直到解析到他是一个普通值
                }, e => {
                    if (called) return;
                    called = true;
                    reject(e);
                });
            } else {
                resolve(x); // 普通对象直接 resolve
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        } 
    } else {
        resolve(x); // 基本类型直接 resolve
    }
}

function isPromise(val) {
    return val && (typeof val.then === 'function');
}

class Promise {
    static resolve = function(x) {
        return new Promise(resolve => resolve(x))
    }
    static reject = function(x) {
        return new Promise((resolve, reject) => reject(x));
    }
    static all = function(promises) {
        return new Promise((resolve, reject) => {
            let result = [];
            let count = 0;
            function processData(index, data) {
                result[index] = data;
                if (++count === promises.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                let p = promises[i];
                if (isPromise(p)) {
                    p.then(val => {
                        processData(i, val);
                    }, reject)
                } else {
                    processData(i, p);
                }
            }
        });
    }
    static race = function(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(resolve, reject);
            })
        });
    }
    static allSettled = function(promises) {
        return new Promise((resolve, reject) => {
            let result = [];
            let count = 0;
            const callback = (val, index) => {
                result[index] = val;
                if (++count === promises.length) {
                    resolve(result);
                }
            }
            promises.forEach((promise, index) => {
                if (isPromise(promise)) {
                    promise.then(val => {
                        callback(val, index)
                    }, e => {
                        callback(e, index);
                    })
                } else {
                    callback(promise, index);
                }
            })
        })
    }
    constructor(executor) {
        this.status = status.PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = []; // 存放成功回调
        this.onRejectedCallbacks = []; // 存放失败回调
        const resolve = (value) => {
            if (value instanceof Promise) {
                return value.then(resolve, reject); // 如果 value 是个 Promise，递归执行
            }
            if (this.status === status.PENDING) {
                this.status = status.FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status === status.PENDING) {
                this.status = status.REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        // onFulfilled onRejected 为可选参数
        // 参数透传 Promise.resolve(1).then().then((value) => console.log(value))
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }; 
        let promise2 = new Promise((resolve, reject) => { // then 必须返回一个新的 promise
            if (this.status === status.FULFILLED) {
                setTimeout(() => { // 保证 onFulfilled、onRejected异步执行，同时能拿到 promise2
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            }
            if (this.status === status.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } 
            if (this.status === status.PENDING) { // 处理异步
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
                this.onRejectedCallbacks.push(() => {
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
        return this.then(data => {
            return Promise.resolve(callback()).then(() => data);
        }, err => {
            return Promise.resolve(callback()).then(() => {
                throw err
            })
        })
    }
}
// finally all resolve reject race allSettled

function wrap(p1) { // 实现中断 promise
    let abort;
    let p2 = new Promise((resolve, reject) => {
        abort = reject;
    })
    p2 = Promise.race([p1, p2]);
    p2.abort = abort;
    return p2;
}
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 2000)
})
let p2 = wrap(p1);
p2.then(data => {
    console.log('data: ', data);
}, err => {
    console.log('err: ', err);
})
setTimeout(() => {
    p2.abort('错误信息');
}, 100)

Promise.defer = Promise.deferred = function() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}

module.exports = Promise;
console.log('11 :>> ', 11);