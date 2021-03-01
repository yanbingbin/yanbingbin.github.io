// 1. typeof 不能判断对象类型 typeof [] {}
// 2. constructor 可以找到这个变量是通过谁构造出来的
// 3. instanceof 判断谁是谁的实例 __proto__
// 4. Object.prototype.toString.call() 不能细分谁是谁的实例

const checkType = (type, value) => {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
};
const currying = (fn, arr = []) => {
    const len = fn.length; // 函数的参数个数
    console.log('len: ', len);
    return function(...args) {
        arr = [...arr, ...args];
        if (arr.length < len) {
            currying(fn, arr); // 继续递归产生函数
        } else {
            fn(...arr); // 参数够了，执行函数
        }
    }
};
const isArray = currying(checkType)('Array');
const isString = currying(checkType)('String');
console.log(isArray([]));
console.log(isString(''));