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

class Promise {
    constructor(executor) {
        this.status = status.PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = []; // 存放成功回调
        this.onRejectedCallbacks = []; // 存放失败回调
        const resolve = (value) => {
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
        } catch (err) {
            reject(err);
        }
    }
    then(onFulfilled, onRejected) {
        if (this.status === status.FULFILLED) {
            onFulfilled(this.value);
        } else if (this.status === status.REJECTED) {
            onRejected(this.reason);
        } else if (this.status === status.PENDING) { // 处理异步
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            })
        }
    }
}

let promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('xxx');
	}, 1000);
});
// 发布订阅模式应对异步 支持一个promise可以then多次
promise.then((res) => { 
	console.log('成功的结果1', res);
}, (error) => { 
	console.log(error);
});
promise.then((res) => { 
	console.log('成功的结果2', res);
}, (error) => { 
	console.log(error);
});