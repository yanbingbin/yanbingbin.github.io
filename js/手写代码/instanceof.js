// 思路：

// 步骤1：先取得当前类的原型，当前实例对象的原型链
// ​步骤2：一直循环（执行原型链的查找机制）
// 取得当前实例对象原型链的原型链（proto = proto.__proto__，沿着原型链一直向上查找）
// 如果 当前实例的原型链__proto__上找到了当前类的原型prototype，则返回 true
// 如果 一直找到Object.prototype.__proto__ == null，Object的基类(null)上面都没找到，则返回 false
function selfInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto === right.prototype) {
            return true;
        }
        if (proto === null) {
            return false;
        }
        proto = Object.getPrototypeOf(proto);
    }
}
const Food = function() {};
const meat = new Food();

console.log('meat instanceof Food  :>> ', meat instanceof Food );// true

console.log('selfInstanceof(meat, Food) :>> ', selfInstanceof(meat, Food)); // true