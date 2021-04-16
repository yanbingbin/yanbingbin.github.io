// 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
// 防抖函数原理：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
const debounce = (func, wait = 500, immediate = false) => {
    let timer = null;
    return function (...args) {
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

function debounce(fn, wait = 500) {
    let timeout = null; // 创建一个标记用来存放定时器的返回值
    return function () {
        clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
        timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
            fn.apply(this, arguments);
        }, wait);
    };
}
// 高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率
// 节流函数原理：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
const throttle = function (fn, wait = 1000) {
	let nowTime;
	let lastTime = 0;
	return function () {
		nowTime = new Date().getTime();
		if (nowTime - lastTime > wait) {
			fn.apply(this, arguments);
			lastTime = nowTime;
		}
	};
};
const throttle = (func, wait = 500) => {
    let timer = null;
    let prevTime = 0;
    return function (...args) {
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