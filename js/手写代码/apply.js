// apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。

Function.prototype.selfApply = function(context, args) {
    context = context || window;
    const key = Symbol('key');
    context[key] = this;
    let res = context[key](...args);
    delete context[key];
    return res;
}
const numbers = [5, 6, 2, 3, 7];

const max = Math.max.selfApply(null, numbers);

console.log(max);
// expected output: 7

const min = Math.min.selfApply(null, numbers);

console.log(min);
// expected output: 2