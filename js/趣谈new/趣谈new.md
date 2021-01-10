最近天气好冷，上下班骑着小电驴，风吹得整个人都是冰冰的，小伙伴要注意保暖，千万别冷到了。

![](http://wx1.sinaimg.cn/large/006APoFYly1glhq09gj10j30nq0p0whv.jpg =300x300)

## new简介

我们先来看看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)上给出的简介

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

new 关键字大家都不陌生，用来给构造函数创建实例的，但是 new 它到底干了些什么，可能就不是很清楚了，下面我来给大家解开 new 的神秘面纱。

我们先来复习下 new 的使用，来看看 new 的功能，先知道 new 做了什么事情才能更好的去实现它。

![](http://ww2.sinaimg.cn/large/9150e4e5ly1fswbux3qi6j206y06cmx4.jpg =150x150)

```js
function Pig(name, age) {
    this.name = name;
    this.age = age;
    this.habit = '吃棒棒糖';
}

Pig.prototype.sayName = function() {
    console.log('我叫' + this.name);
}

Pig.prototype.skill = '降龙十巴掌！(๑•̀ㅂ•́) ✧';

let GGBond = new Pig("猪猪侠", 13);

console.log(GGBond); // Pig { name: '猪猪侠', age: 13, habit: '吃棒棒糖', __proto__: Object }
console.log(GGBond.name); // 猪猪侠
console.log(GGBond.skill); // 降龙十巴掌！(๑•̀ㅂ•́) ✧
GGBond.sayName(); // 我叫猪猪侠
```

通过上面的栗子我们可以看到 new 出来的实例对象：
1. 能访问到构造函数 Pig 中的私有属性
2. 能访问到构造函数 Pig.prototype 上的属性

## new的实现

通过上面的例子我们已经明白了 new 的功能了，但是具体 new 是怎么做到的呢？让我们来看看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)。

> 1. 创建一个空的简单JavaScript对象（即{}）；
> 2. 链接该对象（设置该对象的constructor）到另一个对象 ；
> 3. 将步骤1新创建的对象作为this的上下文 ；
> 4. 如果该函数没有返回对象，则返回this。

我们跟着这个功能来一步步实现 new 吧！

![](http://wx1.sinaimg.cn/large/ceeb653ely1g1vn34rcc0g209406uqq3.gif)

### 创建空对象

创建一个空的简单JavaScript对象（即{}）；
- 因为 new 是关键字，没办法覆盖，所有我们使用函数来模拟 new 的效果，将构造函数以第一个参数进行传入

```js
function myNew(Ctor, ...args) {
    let obj = {}; 
}
```

### 链接对象

链接该对象（设置该对象的constructor）到另一个对象 ；
- 因为我们的实例需要能够访问到构造函数的原型，我们将新对象的 __proto__ 指向构造函数，js 会通过这个属性向上查找原型链，立个flag，下周我会继续出一篇关于原型链的文章，有兴趣的小伙伴可以点个关注。

```js
function myNew(Ctor, ...args) {
    let obj = {}; 
    obj.__proto__ = Ctor.prototype;
}
```

### 修改上下文

将步骤1新创建的对象作为this的上下文 ；
- 修改上下文的方法有很多， bind 、 call 、apply 都可以修改我们的上下文，这里我使用 apply 进行修改，注意这里还隐式包含了指行一次构造函数。
- 绑定 this 指向创建的实例对象

```js
function myNew(Ctor, ...args) {
    let obj = {}; 
    obj.__proto__ = Ctor.prototype;
    const result = Ctor.apply(obj, args);
}
```

### 返回结果

如果该函数没有返回对象，则返回this。

```js
function myNew(Ctor, ...args) {
    let obj = {}; // 创建实例对象
    obj.__proto__ = Ctor.prototype; // 原型链继承
    const res = Ctor.apply(obj, args); // 修改 this 指向实例
    if (/^(object|function)$/.test(typeof res)) return res; // 构造函数返回的是对象就直接该返回该结果
    return obj; // 否则返回实例
}
```

## 测试功能

代码写完了，我们来执行上面的例子来看下是否和原生 new 表现一致

```js
function Pig(name, age) {
    this.name = name;
    this.age = age;
    this.habit = '吃棒棒糖';
}
Pig.prototype.sayName = function() {
    console.log('我叫' + this.name);
}
Pig.prototype.skill = '降龙十巴掌！(๑•̀ㅂ•́) ✧';

function myNew(Ctor, ...args) {
    let obj = {}; // 创建一个实例对象
    obj.__proto__ = Ctor.prototype;
    const res = Ctor.apply(obj, args);
    if (/^(object|function)$/.test(typeof res)) return res;
    return obj;
}

let myGGBond = myNew(Pig, "猪猪侠", 13);

console.log(myGGBond); // Pig { name: '猪猪侠', age: 13, habit: '吃棒棒糖', __proto__: Object }
console.log(myGGBond.name); // 猪猪侠
console.log(myGGBond.skill); // 降龙十巴掌！(๑•̀ㅂ•́) ✧
myGGBond.sayName(); // 我叫猪猪侠

// 测试返回函数

function Dog(name) {
    this.name = name;
    this.habit = '吃骨头';
    return function() {
        console.log('随便输出点什么吧');
    }
}
let myDog = myNew(Dog, '金毛');
console.log(myDog); // ƒ () {...}

// 测试返回对象
function Cat(name) {
    this.name = name;
    this.habit = '吃鱼';
    return {
        name
    }
}
let myCat = myNew(Cat, '黑猫警长');
console.log(myCat); // { name: '黑猫警长' }
```

可以看到和原生的 new 结果是一样的。

非常感谢各位能阅读到这里，觉得有帮助的话不妨点个赞，你的支持是对我对最大的鼓励。

![](http://ww3.sinaimg.cn/bmiddle/006r3PQBjw1fccoeystbuj308c08cwep.jpg =150x150)