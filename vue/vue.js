const toProxy = new WeakMap(); // 代理后的对象
const toRaw = new WeakMap(); // 代理前的对象
let effectsStack = []; // 存储依赖数据
let targetsMap = new WeakMap();

// {
//     target: {
//         key: [dep1, dep2]
//     }
// }

function isObject(target) {
    return typeof target === 'object' && target !== null;
}
function hasOwn(target, key) {
    return target.hasOwnProperty(key);
}
const baseHandler = {
    set(target, key, value, receiver) { // receiver：它总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例
        const hadKey = hasOwn(target, key);
        const oldValue = target[key];
        const res = Reflect.set(target, key, value, receiver);

        if (!hadKey) { // 新增属性
            trigger(target, key, 'ADD'); 
        } else if (oldValue !== value) { // 设置属性老值不等于新值
            trigger(target, key, 'SET'); 
        }
        
        return res;
    },
    get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);
        track(target, key); // 收集依赖，如果目标上的key变化，执行栈中的effect
        return isObject(res) ? reactive(res) : res;
    },
    del(target, key) {
        return Reflect.deleteProperty(target, key);
    }
};

function reactive(target) {
    // 判断是否对象，proxy只对对象进行代理
    if (!isObject(target)) {
        return target;
    }
    const proxy = toProxy.get(target); // 当前对象在代理表中,直接返回该对象
    if (proxy) { 
        return proxy;
    }
    if (toRaw.has(target)) { // 当前对象是代理过的对象
        return target;
    }
    const observed = new Proxy(target, baseHandler);
    toProxy.set(target, observed);
    toRaw.set(observed, target);
    return observed;
}

function track(target, key) { // 如果taeget中的key发生改变，执行栈中的effect方法
    const effect = effectsStack[effectsStack.length - 1];
    // 最新的effect，有才创建关联
    if (effect) {
        let depsMap = targetsMap.get(target);
        if (!depsMap) { // 第一次渲染没有,设置对应的匹配值
            targetsMap.set(target, depsMap = new Map());
        }
        let deps = depsMap.get(key);
        if (!deps) { // 第一次渲染没有,设置对应的匹配值
            depsMap.set(key, deps = new Set());
        }
        if (!deps.has(effect)) {
            deps.add(effect); // 将effect添加到当前的targetsMap对应的target的存放的depsMap里key对应的deps
        }
    }
}

function trigger(target, key, type) {
    // console.log(`set value:${type}`, key)
    // 触发更新，找到依赖effect
    let depsMap = targetsMap.get(target);
    if (depsMap) {
        let effects = new Set();
        let deps = depsMap.get(key);
        if (deps) {
            deps.forEach(effect => {
                effects.add(effect);
            });
        }
        if ((type === 'ADD' || type === 'DELETE') && Array.isArray(target)) {
            const iterationKey = 'length';
            const deps = depsMap.get(iterationKey);
            if (deps) {
                deps.forEach(effect => {
                    effects.add(effect);
                });
            }
        }
        effects.forEach(effect => effect());
    }
}

function watchEffect(fn, options = {}) {
    // 创建一个响应式的影响函数，往effectsStack push一个effect函数，执行fn
    const effect = createReactiveEffect(fn, options);
    // if (!options.lazy) {
    //     effect()
    // }
    return effect;
}

function createReactiveEffect(fn) {
    const effect = function() {
        // 判断栈中是否已经有过该effect,避免递归循环重复添加，比如在监听函数中修改依赖数据
        if (!effectsStack.includes(effect)) { 
            try {
                effectsStack.push(effect); // 将当前的effect推入栈中
                return fn(); // 执行fn
            } finally {
                effectsStack.pop(effect); // 避免fn执行报错，在finally里执行,将当前effect出栈
            }
        }
    }
    effect(); // 默认执行一次
}

// function computed(fn) {
//     const runner = watchEffect(fn, { lazy: true, computed: true });
//     return {
//         effect: runner,
//         get value() {
//             return runner();
//         }
//     }
// }

let person = reactive({
    name: '烟花渲染离别',
});

// watchEffect(() => {
//     console.log(person.name); // 内部依赖逻辑必须是同步的
// });
// person.name = '更新后的名字是我';

// 异步案例
// watchEffect(() => {
//     setTimeout(() => {
//         console.log(person.name); // 内部依赖逻辑必须是同步的
//     }, 0);
// });
// setTimeout(() => {
    // person.name = '更新后的名字是我';
// }, 1000);

// 数组修改长度案例
// let data = { foo: 'foo', ary: [1, 2, 3] };
// let r = reactive(data);
// watchEffect(() => console.log(r.ary.length));
// r.ary.unshift(1);  // 4