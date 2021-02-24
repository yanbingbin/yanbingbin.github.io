
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

// let symbol = Symbol('我是独一无二的值');
// let obj = {
//     [symbol]: [1]
// };
// console.log('obj: ', obj);
// const obj2 = deepClone(obj);
// obj2[symbol].push(2);
// console.log('obj2: ', obj2);
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
    func: () => { console.log('我是函数'); },
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