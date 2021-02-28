// new操作符做了这些事：
// 创建一个全新的对象，这个对象的__proto__要指向构造函数的原型对象
// 执行构造函数
// 返回值为object类型则作为new方法的返回值返回，否则返回上述全新对象
function selfNew(Ctor, ...args) {
    let instance = Object.create(Ctor.prototype); // instance.__proto__ = Ctor.prototype;
    let res = Ctor.apply(instance, args);
    if (/^(object|function)$/.test(typeof res)) return res;
    return instance;
}

function Pig(name, age) {
    this.name = name;
    this.age = age;
    this.habit = '吃棒棒糖';
}
Pig.prototype.sayName = function() {
    console.log('我叫' + this.name);
}
Pig.prototype.skill = '降龙十巴掌！(๑•̀ㅂ•́) ✧';

let myGGBond = selfNew(Pig, "猪猪侠", 13);
console.log('myGGBond: ', myGGBond);
console.log(myGGBond); // Pig { name: '猪猪侠', age: 13, habit: '吃棒棒糖', __proto__: Object }
console.log(myGGBond.name); // 猪猪侠
console.log(myGGBond.skill); // 降龙十巴掌！(๑•̀ㅂ•́) ✧
myGGBond.sayName(); // 我叫猪猪侠