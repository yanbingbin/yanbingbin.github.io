## bind简介

我们先来看看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)上给出的简介

> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

![](http://wx1.sinaimg.cn/bmiddle/006APoFYly1fzlsxf91qqj306o06oq3f.jpg =150x150)

是不是看不太懂，没关系我翻译一下，说人话就是 bind 函数执行完会返回一个新的函数，后续我们都称为绑定函数，执行这个绑定函数时， this 的指向就会变成 bind 函数的第一个参数，其他参数会作为返回的绑定函数的参数，在执行绑定函数的时候再传入到这个函数中。
这下明白了吧，什么？你没听明白，管你听没听懂，看就完事。

举个例子：

```js
const module = {
    x: 42,
    getX: function (y = 0) {
        return this.x + y;
    }
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // NaN 该函数在全局作用域中被调用,此时this指向的是window, 

const boundGetX = unboundGetX.bind(module); // 这个时候我们将新的函数的this指向通过bind改成了module
console.log(boundGetX()); // 42
console.log(boundGetX(3)); // 45
```

## bind的实现

通过上面的例子我们已经明白了 bind 的功能了，可以我们动手实现 bind 函数了。

### 初步模拟实现

在写代码前我们需要了解下 bind 有哪些特性，然后我们可以根据它的特性来进行实现
- bind 是挂载在 function 的原型上的，所以 function 能直接调用
- bind 会返回一个新的函数
- bind 传递的第一个参数会绑定为新函数的 this 的指向
- bind 的其他参数会作为绑定函数的参数

```js
Function.prototype.selfBind = function (context, ...bindArgs) {
    const self = this;
    return function (...args) {
        return self.apply(context, bindArgs.concat(args)); // 利用apply修改指向传入的第一个参数，同时参数拼接给新的函数
    }
}
```

代码写完了，我们来执行上面的例子来看下是否满足要求

```js
const module = {
    x: 42,
    getX: function (y = 0) {
        return this.x + y;
    }
};

Function.prototype.selfBind = function (context, ...bindArgs) {
    const self = this;
    return function (...args) {
        return self.apply(context, bindArgs.concat(args));
    }
}

const unboundGetX = module.getX;
const boundGetX = unboundGetX.selfBind(module); // 使用自己自定义的bind修改this指向
console.log(boundGetX()); // 42，输出的值和原生bind一样
console.log(boundGetX(3)); // 45，输出的值和原生bind一样
```

### new构造函数处理

这样我们就实现...实现好了吗？

![](http://wx1.sinaimg.cn/bmiddle/ceeb653ely1ftifuucm4gj206o06oa9w.jpg =150x150)

我们来看看MDN的原话吧。

> 绑定函数自动适应于使用 new 操作符去构造一个由目标函数创建的新实例。当一个绑定函数是用来构建一个值的，原来提供的 this 就会被忽略。不过提供的参数列表仍然会插入到构造函数调用时的参数列表之前。

什么意思呢？就是我们可以把 bind 返回的函数当做构造函数去用 new 操作符创建实例的时候，bind 传入的 this 指向会失效，但是传入的参数还是有效的。

我们先来看看原生的 bind 效果吧

```js
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
const boundGetX = unboundGetX.bind(module); // 注意这里是用的原生的bind
const instance = new boundGetX(3);
// this.x:  undefined
// y: 3
console.log(instance.property); 
// 我是getX自带的属性
console.log(instance.prototypeProperty); 
// 我是getX原型上的属性
```

这里我们可以看到 this 指向的不是传入的 module 而且 getX ，这其实是 new 操作符带来的影响，下周我会继续出一篇关于 new 操作符的内幕，有兴趣的小伙伴可以点个关注。我知道你们这时候都是

![](http://ww3.sinaimg.cn/bmiddle/9150e4e5ly1fjw8y9z6svj208c0apmxf.jpg =150x150)

那么我们现在来处理下被 new 的情况

```js
Function.prototype.selfBind = function (context, ...bindArgs) {
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
```

结果验证

```js
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
```

和原生的 bind 返回一样，这样我们就完整的实现了一个原生的 bind 方法？？？no no no，这还不够严谨，我们还需要对调用 bind 的对象进行一个类型校验

### 添加类型校验

为了避免一些特殊情况的发生，比如：

```js
let obj = {};
obj.__proto__ = Function.prototype;
obj.selfBind(module);
```

我们就需要对调用者进行一个类型校验了,判断 this 类型是否是 function 即可

```js
if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.selfBind - what is trying to be bound is not callable');
}
```

### 完整代码

```js
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
```

非常感谢各位能阅读到这里，觉得有帮助的话不妨点个赞，你的支持是对我对最大的鼓励。

![](http://ww3.sinaimg.cn/bmiddle/006r3PQBjw1fccoeystbuj308c08cwep.jpg =150x150)

新一篇的 new 已经更新了，欢迎各位看官捧场！！

[趣谈new](https://juejin.cn/post/6916119250251972616)