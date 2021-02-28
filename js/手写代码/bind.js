// bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
// 绑定函数自动适应于使用 new 操作符去构造一个由目标函数创建的新实例。当一个绑定函数是用来构建一个值的，原来提供的 this 就会被忽略。不过提供的参数列表仍然会插入到构造函数调用时的参数列表之前。
Function.prototype.selfBind = function(context, ...bindArgs) {
    if (typeof this !== 'function') {
        throw new TypeError('参数类型错误');
    }
    const self = this;
    let fBound = function(...args) {
        // 如果绑定函数作为构造函数使用，通过判断this是否继承原函数，this指向当前实例，self指向需要绑定的函数
        return self.apply(this instanceof self ? this : context, bindArgs.concat(args));
    }
    // 修改绑定函数的prototype为要绑定的函数的prototype，实例就能继承函数的原型，这样上面才能用instanceof判断this是否继承self
    fBound.prototype = Object.create(this.prototype);
    return fBound;
}

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

const unboundGetX = module.getX;
const boundGetX = unboundGetX.selfBind(module); // 注意这里是用的原生的bind
const instance = new boundGetX(3);
// this.x:  undefined
// y: 3
console.log(instance.property); 
// 我是getX自带的属性
console.log(instance.prototypeProperty); 
// 我是getX原型上的属性