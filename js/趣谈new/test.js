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
console.log('GGBond: ', GGBond); // Pig { name: '猪猪侠', age: 13, habit: '吃棒棒糖', __proto__: Object }
console.log(GGBond.name); // 猪猪侠
GGBond.sayName(); // 我叫猪猪侠
console.log(GGBond.skill); // 降龙十巴掌！(๑•̀ㅂ•́) ✧


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

function Dog(name) {
    this.name = name;
    this.habit = '吃骨头';
    return function() {
        console.log('this :>> ', this);
    }
}
let myDog = myNew(Dog, '金毛');
console.log(myDog); // ƒ () {...}


function Cat(name) {
    this.name = name;
    this.habit = '吃鱼';
    return {
        name
    }
}
let myCat = myNew(Cat, '黑猫警长');
console.log(myCat); // { name: '黑猫警长' }