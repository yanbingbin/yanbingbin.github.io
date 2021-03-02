let nextSchedule = Promise.resolve();
const CreateSchedule = () => {
    let next;
    let preSchedule = nextSchedule;
    nextSchedule = new Promise((resolve, reject) => {
        next = resolve;
    });
    return {
        start: async (done) => {
            await preSchedule; // 先等待上一个调度完成执行
            done(); // 触发某种条件，让任务能够开始
        },
        complete: () => {
            next(); // 执行下一个任务
        }
    }
}
function Component() {
}
Component.prototype.load = function() {
    setTimeout(() => {
        console.log('1 :>> ', 1);
        this.schedule.complete(); // 任务完成
    }, 1000);
}
Component.prototype.init = async function() {
    this.schedule = CreateSchedule();
    this.schedule.start(() => {
        this.load(); // 执行任务
    });
}
let c = new Component();
c.init();
let a = new Component();
a.init();
let b = new Component();
b.init();
let d = new Component();
d.init();