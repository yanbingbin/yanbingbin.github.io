// call做了什么:
// 将函数设为对象的属性
// 执行&删除这个函数
// 指定this到函数并传入给定参数执行函数
// 如果不传入参数，默认指向为 window

Function.prototype.selfCall = function (context, ...args) {
    context = context || window;
    const key = Symbol('key');
    context[key] = this;
    let res = context[key](...args);
    delete context[key];
    return res;
}

function greet() {
    var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
    console.log(reply);
}

var obj = {
    animal: 'cats',
    sleepDuration: '12 and 16 hours'
};

greet.selfCall(obj); // cats typically sleep between 12 and 16 hours