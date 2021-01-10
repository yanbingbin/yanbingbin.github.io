const module = {
    x: 42,
    getX: function (y = 0) {
        console.log('this.x: ', this.x);
        console.log('y :', y);
        this.property = '我是getX自带的属性';
        return this.x + y;
    }
};
module.getX.prototype.prototypeProperty = '我是getX原型上的属性'; // 给getX原型挂载数据


Function.prototype.selfBind = function (context, ...bindArgs) {
    if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    const self = this;
    let fBound = function (...args) {
        // 如果绑定函数作为构造函数使用，通过判断this是否继承原函数，this指向当前实例，self指向需要绑定的函数
        return self.apply(this instanceof self ? this : context, bindArgs.concat(args));
    }
    // 修改绑定函数的prototype为要绑定的函数的prototype，实例就能继承函数的原型，这样上面才能用instanceof判断this是否继承self
    function Fn() {};
    Fn.prototype = this.prototype;
    fBound.prototype = new Fn();
    return fBound;
}

let obj = {};
obj.__proto__ = Function.prototype;
obj.selfBind(module);

const unboundGetX = module.getX;
const boundGetX = unboundGetX.selfBind(module); // 注意这里是用的原生的bind
const instance = new boundGetX(3);
// this.x:  undefined
// y: 3
console.log(instance.property);
// 我是getX自带的属性
console.log(instance.prototypeProperty);
// 我是getX原型上的属性