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
        const resolve = (value) => {
            if (this.status === status.PENDING) {
                this.status = status.FULFILLED;
                this.value = value;
            }
        }
        const reject = (reason) => {
            if (this.status === status.PENDING) {
                this.status = status.REJECTED;
                this.reason = reason;
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
        }
    }
}
