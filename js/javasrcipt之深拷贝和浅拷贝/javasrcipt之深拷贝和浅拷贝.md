<!-- 浅拷贝与深拷贝之终极无敌之上帝视角之全面深入了解 -->
## 引子

在工作中经常会遇到一个场景，表格的数据需要用弹框修改时，我们将数据传入弹框，此时修改弹框中传入的数据，会惊奇的发现表格的数据也变化了，这是为什么呢？怎么避免出现这种情况？不着急，看完这篇文章，大家一切都会明白。

## 数据类型

说起拷贝，就不得不提起 `js` 的数据类型了，因为深拷贝和浅拷贝的核心点就在于不同的数据类型在内存中存储的方式不同。

### ECMAScript 基本数据类型

最新的 `ECMAScript` 标准定义了 8 种数据类型，其中 7 中是基本数据类型，它们是：`Boolean`、`Null`、`Undefined`、`Number`、`String`、`BigInt`、`Symbol`。

基本数据类型都是存储在栈（`stack`）内存中，栈具有先进后出的特点，基本数据类型占用空间小、大小固定，通过按值来访问，属于被频繁使用的数据。

所有的基本类型值本身是无法被改变的。可能有的人会有疑问，我天天修改字符串等基本类型值，还不是发生了改变么，其实我们对字符串进行操作后，返回的都是新的字符串，并没有修改原来的数据。

```js
let a = 1;
let b = a;
b = 2;
console.log(a, b); // 1 2
```

基本数据类型的赋值，赋值后两个变量互不影响，`b`复制的是`a`的原始值，它们存储在独立的的栈空间中，因此修改了`b`的值，`a`的值不会受到影响，大家可以查看下图更清晰的了解。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a681319bfd6484f8a458cf01fa9ccd5~tplv-k3u1fbpfcp-watermark.image)

### ECMAScript 引用数据类型

引用数据类型 `Object`，像 `Array`、`Function`、`Date`...等都属于 `Object`，它们的值都是对象。

引用数据类型存放在堆内存中，可以直接进行访问和修改。

引用数据类型占据空间大、大小不固定，存放在栈中会有性能的问题。引用数据类型在栈中保存了一份指针，该指针指向对应的数据在堆中的起始地址，当解释器寻找引用值时，会首先检索其在栈中的地址，通过地址从堆中获得数据。

```js
let obj = { name: '烟花渲染离别' };
let obj2 = obj;
obj2.name = '七宝';
console.log(obj.name); // 七宝
console.log(obj2.name); // 七宝
```
引用类型的赋值，在栈中复制了一份引用类型的地址指针，两个变量指向的还是同一个对象，所以修改了`obj2.name`，`obj.name`也会发生改变，这种改变有时候并不是我们所期望的，这时候就需要拿出我们的秘技：浅拷贝和深拷贝。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adeba38dff46430aa343a34ea679dde0~tplv-k3u1fbpfcp-watermark.image)

## 浅拷贝

浅拷贝就是将源对象的属性拷贝一份，如果属性时基本类型值，直接拷贝基本类型值，如果属性是引用类型，则拷贝的是该引用类型在堆中的地址。下面介绍几种常用的浅拷贝方法：

### 展开运算符 ...

个人常用的浅拷贝就是 `...`展开运算符了，展开运算符是`es6`的新特性，相信大家都已经很了解了，不了解的可以前往阮一峰大神的[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6)查看。

```js
let obj = { name: '烟花渲染离别' };
let obj2 = { ...obj };
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝
```

### Object.assign()

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。

我一般是在需要合并两个对象成为一个新对象时使用这个方法。

```js
let obj = { name: '烟花渲染离别' };
let obj2 = Object.assign({}, obj);
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝
```

### concat和slice

这两个方法常用来拷贝数组。

```js
let arr = [1, 2];
let arr2 = arr.concat();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]
```

```js
let arr = [1, 2];
let arr2 = arr.slice();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]
```

### 浅拷贝的问题

有了浅拷贝后，为什么还需要深拷贝呢？自然是因为浅拷贝是有缺陷的，如果拷贝的对象中属性有引用类型值的话，浅拷贝就不能达到预期的完全复制隔离的效果了，下面来看个例子：

```js
let obj = { name: '烟花渲染离别', hobby: ['看动漫'] };
let obj2 = { ...obj };
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝

obj.hobby.push('打球');
console.log(obj.hobby); // ['看动漫', '打球']
console.log(obj2.hobby); // ['看动漫', '打球']
console.log(obj.hobby === obj2.hobby); // true
```

可以看到浅拷贝后，`obj.hobby`的修改影响到了`obj2.hobby`，根据我们上面引用类型的赋值，我们可以大胆推测，浅拷贝拷贝的是`hobby`的指针。同样画个图方便大家理解。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3034ddb3e0bd45389b279f1684572099~tplv-k3u1fbpfcp-watermark.image)

既然浅拷贝有这种问题，那我们肯定想要避免这个问题，怎么去避免这个问题呢？这就要用到我下面要讲的深拷贝了。

## 深拷贝

深拷贝，顾名思义就是比浅拷贝能够更深层级的拷贝，它能够将拷贝过程中遇到的引用类型都新开辟一块地址拷贝对应的数据，这样就能避免子对象共享同一份内存的问题了。

### JSON.parse(JSON.stringify())

```js
let obj = { name: '烟花渲染离别', hobby: ['看动漫'] };
let obj2 = JSON.parse(JSON.stringify(obj));
obj.hobby.push('打球');
console.log(obj.hobby); // ['看动漫', '打球']
console.log(obj2.hobby); // ['看动漫']
```

基于`JSON.stringify`将对象先转成字符串，再通过`JSON.parse`将字符串转成对象，此时对象中每个层级的堆内存都是新开辟的。

这种方法虽然简单，但它还有几个缺陷：
1. 不能解决循环引用的问题
2. 无法拷贝特殊对象，比如：`RegExp`、`BigInt`、`Date`、`Set`、`Map`等

### 手写深拷贝

既然利用`js`内置的方法进行深拷贝有缺陷的话，那我们就自己动手实现一个深拷贝吧。

实现深拷贝之前思考下我们思考下应该怎么去实现，其实核心就是：浅拷贝 + 递归。
- 对于基本数据类型，我们直接拷贝即可
- 对于引用数据类型，则需要进行递归拷贝。

我们先动手实现一个功能类似`JSON.parse(JSON.stringify())`的简单深拷贝，能对对象和数组进行深拷贝

```js
// 获取对象
function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function deepClone(target) {
    if (!isObject(target)) return target; // 拷贝基本类型值

    let cloneTarget = Array.isArray(target) ? [] : {}; // 判断拷贝的是否是数组
    Object.keys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key]); // 递归拷贝属性
    });
    return cloneTarget;
}

let obj = { name: '烟花渲染离别', hobby: ['看动漫'] };
let obj2 = deepClone(obj);
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝

obj.hobby.push('打球');
console.log(obj.hobby); // ['看动漫', '打球']
console.log(obj2.hobby); // ['看动漫']
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/637e7e06bcab4ff287ffb666bb3873c0~tplv-k3u1fbpfcp-watermark.image)

可以看到基本实现了`JSON.parse(JSON.stringify())`的深拷贝功能，但是我们都知道这种方法的缺陷，那我们继续完善深拷贝方法。
### 处理循环引用

什么是循环引用呢？简单来说就是自己内部引用了自已，和递归的自己调用自己有点像，来看个例子吧：

```js
let obj = { name: '烟花渲染离别' };
obj.info = obj;
console.log(obj);
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b5a4ae7eb0f480d9d6d86abe764791a~tplv-k3u1fbpfcp-watermark.image)

如果使用上面的深拷贝的话，因为没有处理循环引用，就会导致`info`属性一直递归拷贝，递归死循环导致栈内存溢出。

<!-- ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c5df9102cb44beb9c0337f6448b37b6~tplv-k3u1fbpfcp-watermark.image) -->

如何处理循环引用呢？我们可以开辟一个空间存储要拷贝过的对象，当拷贝当前对象时，先去存储空间查找该对象是否被拷贝过，如果拷贝过，直接返回该对象，如果没有拷贝过就继续拷贝。

```js
function deepClone(target, cache = new WeakSet()) { 
    if (!isObject(target)) return target; // 拷贝基本类型值
    if (cache.has(target)) return target; // 如果之前已经拷贝过该对象，直接返回该对象
    cache.add(target); // 将对象添加缓存

    let cloneTarget = Array.isArray(target) ? [] : {}; // 判断拷贝的是否是数组
    Object.keys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性，将缓存传递
    });
    return cloneTarget;
}
```
这里采用了`WeakSet`收集拷贝对象，`WeakSet`中的对象都是弱引用的，垃圾回收机制不考虑`WeakSet`对该对象的引用。如果我们拷贝的对象很大的时候，使用`Set`会导致很大的内存消耗，需要我们手动清除`Set`中的数据才能释放内存，而`WeakSet`则不会有这样的问题。

<!-- ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e80fbf0ec89495fb0ab773d3f294291~tplv-k3u1fbpfcp-watermark.image) -->

<!-- 可以看到就算对象有循环引用的问题也能成功复制。 -->

### 处理键是 Symbol 类型

`Symbol 值`作为键名，无法被`Object.keys()`、`Object.getOwnPropertyNames()`、`for..in`、`for..of`获取到。

```js
let symbol = Symbol('我是独一无二的值');
let obj = { name: '烟花渲染离别', [symbol]: '' };
const obj2 = deepClone(obj);
console.log(obj2); // { name: "烟花渲染离别" }
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af96f3aa9c64467391a3246a094047c1~tplv-k3u1fbpfcp-watermark.image)

可以看到，深拷贝后并没有拿到`Symbol`属性的，我们可以通过`Object.getOwnPropertySymbols()`来获取到对象上面所有的`Symbol`键。但是我们不仅仅需要获取`Symbol`属性，还需要获取其他属性，我们可以使用`Reflect.ownKeys()`来拿到对象的所有属性。

```js
function deepClone(target, cache = new WeakSet()) {
    if (!isObject(target)) return target; // 拷贝基本类型值
    if (cache.has(target)) return target;
    cache.add(target);

    let cloneTarget = Array.isArray(target) ? [] : {}; // 判断拷贝的是否是数组
    Reflect.ownKeys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性
    });
    return cloneTarget;
}

let symbol = Symbol('我是独一无二的值');
let obj = { name: '烟花渲染离别', [symbol]: '' };
console.log(obj); // { name: "烟花渲染离别", Symbol(我是独一无二的值): "" }
const obj2 = deepClone(obj); 
console.log(obj2); // { name: "烟花渲染离别", Symbol(我是独一无二的值): "" }
```

### 处理其他引用类型值

上面只处理了数组和对象，还有其他的很多引用类型的值没进行处理，我们需要先知道要知道要拷贝的是什么类型的对象，我们可以使用`Object.prototype.toString.call()`来获取对象的准确类型。

```js
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const mapTag = '[object Map]'
const setTag = '[object Set]'
const regexpTag = '[object RegExp]'
const boolTag = '[object Boolean]'
const numberTag = '[object Number]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
```

#### 创建拷贝对象

获取到了具体的引用类型后，我们可以根据对应的类型进行初始化对象的操作。通过`target.constructor`拿到拷贝对象的构造函数，通过源对象的构造函数生成的对象可以保留对象原型上的数据，如果使用`{}`，则原型上的数据会丢失。
- `Boolean`、`Number`、`String`、`Date`、`Error`我们可以直接通过构造函数和原始数据创建一个新的对象。
- `Object`、`Map`、`Set`我们直接执行构造函数返回初始值，递归处理后续属性，因为它们的属性可以保存对象。
- `Array`、`Symbol`、`RegExp`进行特殊处理。

```js
function initCloneTargetByTag(target, tag) {
    const Ctor = target.constructor;
    switch (tag) {
        case boolTag:
        case dateTag:
            return new Ctor(+target);

        case numberTag:
        case stringTag:
        case errorTag:
            return new Ctor(target);

        case objectTag:
        case mapTag:
        case setTag:
            return new Ctor();

        case arrayTag:
            return cloneArray(target);

        case symbolTag:
            return cloneSymbol(target);

        case regexpTag:
            return cloneRegExp(target);
    }
}
function deepClone(target, cache = new WeakSet()) {
    ...

    const tag = Object.prototype.toString.call(target);
    let cloneTarget = initCloneTargetByTag(target, tag); // 使用拷贝对象的构造方法创建对应类型的数据

    ...
}
```

#### 初始化 Array

`cloneArray` 是为了兼容处理匹配正则时执行`exec()`后的返回结果，`exec()`方法会返回一个数组，其中包含了额外的`index`和`input`属性。

```js
function cloneArray(array) {
    const { length } = array;
    const result = new array.constructor(length);
  
    if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}
```

#### 初始化 Symbol

```js
function cloneSymbol(symbol) {
    return Object(Symbol.prototype.valueOf.call(symbol));
}
```
#### 初始化 RegExp

```js
function cloneRegExp(regexp) {
    const reFlags = /\w*$/; // \w 用于匹配字母，数字或下划线字符，相当于[A-Za-z0-9_]
    const result = new regexp.constructor(regexp.source, reFlags.exec(regexp)); // 返回当前匹配的文本
    result.lastIndex = regexp.lastIndex; // 下一次匹配的起始索引
    return result;
}
```

#### 处理Map和Set

`map`和`set`有通过独有的`set`、`add`方法设置值，单独处理。

```js
function deepClone(target, cache = new WeakSet()) {
    ...

    if (tag === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, deepClone(value, map));
        });
        return cloneTarget;
    }

    if (tag === setTag) {
        target.forEach(value => {
            cloneTarget.add(deepClone(value, map));
        });
        return cloneTarget;
    }

    ...
}
```

#### 处理函数

事实上，我们直接使用同一个内存地址的函数是没问题的，所以我们可以直接返回该函数，`lodash`上也是这么处理的。

```js
function deepClone(target, cache = new WeakSet()) {
    ...

    if (tag === functionTag) {
        return target;
    }
    
    ...
}
```

### 完整代码

```js
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const mapTag = '[object Map]'
const setTag = '[object Set]'
const functionTag = '[object Function]';
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'

function cloneArray(array) {
    const { length } = array;
    const result = new array.constructor(length);
  
    if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}

function cloneSymbol(symbol) {
    return Object(Symbol.prototype.valueOf.call(symbol));
}

function cloneRegExp(regexp) {
    const reFlags = /\w*$/;
    const result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
}

function initCloneTargetByTag(target, tag) {
    const Ctor = target.constructor;
    switch (tag) {
        case boolTag:
        case dateTag:
            return new Ctor(+target);

        case numberTag:
        case stringTag:
        case errorTag:
            return new Ctor(target);

        case objectTag:
        case mapTag:
        case setTag:
            return new Ctor();

        case arrayTag:
            return cloneArray(target);

        case symbolTag:
            return cloneSymbol(target);

        case regexpTag:
            return cloneRegExp(target);
    }
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function deepClone(target, cache = new WeakSet()) {
    if (!isObject(target)) return target; // 拷贝基本类型值

    if (cache.has(target)) return target;

    cache.add(target);

    const tag = Object.prototype.toString.call(target);
    let cloneTarget = initCloneTargetByTag(target, tag); // 使用拷贝对象的构造方法创建对应类型的数据

    if (tag === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, deepClone(value, map));
        });
        return cloneTarget;
    }

    if (tag === setTag) {
        target.forEach(value => {
            cloneTarget.add(deepClone(value, map));
        });
        return cloneTarget;
    }

    if (tag === functionTag) {
        return target;
    }

    Reflect.ownKeys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性
    });

    return cloneTarget;
}
```

### 测试代码

写完了代码我们肯定得需要测试下代码是否能正常运行，下面来看看吧。

```js
const map = new Map();
map.set('烟花', '渲染离别');
map.set('掘金', 'https://juejin.cn/user/2101921961223614');

const set = new Set();
set.add('set1');
set.add('set2');

let target = {
    arr: [1, 2, 3],
    bool: false,
    bool2: new Boolean(true),
    date: new Date(),
    empty: null,
    error: new Error(),
    func: () => {
        console.log('我是函数');
    },
    map,
    num: 1,
    num2: new Number(1),
    obj: {
        children: {
            name: '我是子对象'
        }
    },
    reg: /\w*$/,
    set,
    str: '烟花渲染离别',
    str2: new String('new String'),
    symbol: Symbol('symbol'),
    symbol: Object(Symbol('new Symbol')),
    undefined: undefined,
};
let cloneTarget = deepClone(target);
console.log(cloneTarget);
target.obj.children.name = '修改子对象';
console.log(cloneTarget.obj.children.name);
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/599e96ca02504560b7c3e3ea7680df15~tplv-k3u1fbpfcp-watermark.image)

### 总结

深拷贝作为面试常考的题目，里面确实涉及到了很多细节：
- 考察你的递归能力
- 考察处理循环引用，还可以深入挖掘对`weakSet`、`weakMap`弱引用的了解程度
- 考察各种引用类型的处理，对数据类型的掌握的程度
- 考察`Symbol`作为对象属性的遍历处理等
希望大家看完这篇文章都能有所收获。
文章如果哪里写的不对，欢迎评论区留言，如果喜欢这篇文章，欢迎点赞，相信我，你的点赞也能化作一道光。


参考文章及源码：

[「前端进阶」JS中的栈内存堆内存](https://juejin.cn/post/6844903873992196110)

[浅拷贝与深拷贝](https://juejin.cn/post/6844904197595332622)

[如何写出一个惊艳面试官的深拷贝?](https://segmentfault.com/a/1190000020255831)

[js 深拷贝 vs 浅拷贝](https://juejin.cn/post/6844903493925371917)

[理解 Es6 中的 Symbol 类型](https://juejin.cn/post/6846687598249771022)

[https://github.com/lodash/lodash/blob/master/.internal/baseClone.js](https://github.com/lodash/lodash/blob/master/.internal/baseClone.js)




![](http://ww4.sinaimg.cn/bmiddle/006APoFYjw1f9lwxs05mvj30if0iejs4.jpg =200x200)
![](http://wx2.sinaimg.cn/bmiddle/005TGG6vly1filq1wz0otj307s07sdft.jpg =200x200)


