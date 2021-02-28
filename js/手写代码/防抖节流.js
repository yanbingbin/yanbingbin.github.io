// 防抖函数原理：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
const debounce = (func, wait = 500, immediate = false) => {
    let timer = null; 
    return function(...args) {
        if (!timer && immediate) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (!immediate) {
                func.apply(this, args)
            }
        }, wait);
    }
}
// 节流函数原理：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
const throttle = (func, wait = 500) => {
    let timer = null;
    let prevTime = 0;
    return function(...args) {
        let now = new Date();
        let remaining = wait - (now - prevTime);
        if (remaining <= 0) {
            // 两次间隔时间超过频率
            timer = null;
            prevTime = now;
            func.apply(this, args);
        } else if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args);
                clearTimeout(timer);
                timer = null;
                prevTime = new Date();
            }, remaining);
        }
    }
}