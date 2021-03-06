// 带有并发限制的调度器
class Scheduler {
    constructor(limit) {
        this.limit = limit
        this.number = 0
        this.queue = []
    }
    addTask(timeout, str) {
        this.queue.push([timeout, str])
        this.start();
    }
    start() {
        if (this.number < this.limit && this.queue.length) {
            var [timeout, str] = this.queue.shift()
            this.number++
            setTimeout(() => {
                console.log(str)
                this.number--
                this.start()
            }, timeout * 1000);
            this.start()
        }
    }
}
let scheduler = new Scheduler(2);
scheduler.addTask(1, '1');   // 1s后输出’1'
scheduler.addTask(2, '2');  // 2s后输出’2'
scheduler.addTask(1, '3');  // 2s后输出’3'
scheduler.addTask(1, '4');  // 3s后输出’4'
// scheduler.start();