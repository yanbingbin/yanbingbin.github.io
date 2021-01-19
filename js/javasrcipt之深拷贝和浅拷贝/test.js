// 基础数据类型
let a = 1;
let b = a;
b = 2;
console.log(a, b); // 1 2
// 引用数据类型
let obj = {
    name: '烟花渲染离别'
};
let obj2 = obj;
obj2.name = '七宝';
console.log(obj.name); // 七宝
console.log(obj2.name); // 七宝
// 浅拷贝
let obj = {
    name: '烟花渲染离别',
    hobby: ['看动漫']
};
let obj2 = {
    ...obj
};
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝

obj.hobby.push('打球');
console.log(obj.hobby); // ['看动漫', '打球']
console.log(obj2.hobby); // ['看动漫', '打球']


let obj = {
    name: '烟花渲染离别'
};
let obj2 = Object.assign({}, obj);
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝

let arr = [1, 2];
let arr2 = arr.concat();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]

obj.hobby.push('打兵乓球');
console.log(obj.hobby); // ['看动漫, 打兵乓球']
console.log(obj2.hobby); // ['看动漫, 打兵乓球']


// 深拷贝
let obj = {
    name: '烟花渲染离别',
    hobby: ['看动漫']
};
let obj2 = JSON.parse(JSON.stringify(obj));
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝

obj.hobby.push('打球');
console.log(obj.hobby); // ['看动漫', '打球']
console.log(obj2.hobby); // ['看动漫']

// 手写深拷贝

// 获取对象上的属性
function getOwnProperties(target) {
    if (target === null) return [];
    return [
        ...Object.keys(target),
        ...Object.getOwnPropertySymbols(target)
    ];
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function deepClone(target) {
    if (!isObject(target)) return target; // 拷贝基本类型值

    const keys = getOwnProperties(target);
    let cloneTarget = Array.isArray(target) ? [] : {};
    keys.forEach(key => {
        cloneTarget[key] = deepClone(target[key]);
    });
    return cloneTarget;
}


// 深拷贝
let obj = {
    name: '烟花渲染离别',
    hobby: ['看动漫']
};
let obj2 = deepClone(obj);
obj2.name = '七宝';
console.log(obj.name); // 烟花渲染离别
console.log(obj2.name); // 七宝

obj.hobby.push('打球');
console.log(obj.hobby); // ['看动漫', '打球']
console.log(obj2.hobby); // ['看动漫']


// 循环引用

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function deepClone(target, cache = new WeakSet()) {
    if (!isObject(target)) return target; // 拷贝基本类型值
    if (cache.has(target)) return target;
    cache.add(target);

    let cloneTarget = Array.isArray(target) ? [] : {}; // 判断拷贝的是否是数组
    Object.keys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性
    });
    return cloneTarget;
}

let obj = {
    name: '烟花渲染离别'
};
obj.info = obj;
console.log(obj);

const obj2 = deepClone(obj);


// 处理键是 Symbol 类型

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

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
let obj = {
    name: '烟花渲染离别',
    [symbol]: ''
};
console.log('obj: ', obj);
const obj2 = deepClone(obj);
console.log('obj2: ', obj2);



// 处理其他引用类型
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const mapTag = '[object Map]'
const setTag = '[object Set]'

const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'

function initCloneArray(array) {
    const {
        length
    } = array;
    const result = new array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}

function initCloneTargetByTag(target) {
    const Ctor = target.constructor;
    switch (tag) {
        case boolTag:
        case dateTag:
        case numberTag:
        case stringTag:
        case errorTag:
            return new Ctor(target);

        case mapTag:
        case setTag:
            return new Ctor;

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

    let cloneTarget;
    const type = Object.prototype.toString.call(target);

    if (type === arrayTag) {
        cloneTarget = initCloneArray(target);
    } else {
        // 使用拷贝对象的构造方法创建对应类型的数据
        const Ctor = target.constructor;
        cloneTarget = new Ctor();
    }




    Reflect.ownKeys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性
    });

    return cloneTarget;
}

let symbol = Symbol('我是独一无二的值');
let obj = {
    [symbol]: [1]
};
console.log('obj: ', obj);
const obj2 = deepClone(obj);
obj2[symbol].push(2);
console.log('obj2: ', obj2);
// 基本实现

// 递归能力
// 循环引用

// 考虑问题的全面性
// 理解weakmap的真正意义
// 多种类型

// 考虑问题的严谨性
// 创建各种引用类型的方法，JS API的熟练程度
// 准确的判断数据类型，对数据类型的理解程度
// 通用遍历：

// 写代码可以考虑性能优化
// 了解集中遍历的效率
// 代码抽象能力
// 拷贝函数：

// 箭头函数和普通函数的区别
// 正则表达式熟练程度