

class Scheduler {
    constructor(max) {
        this.max = max; // 最大任务
        this.runningCount = 0;
        this.callbacks = []; 
    }
    add(promiseMaker) {
        if (this.runningCount < this.max) {
            this.run(promiseMaker);
        } else {
            this.callbacks.push(promiseMaker);
        }
    }
    run(promiseMaker) {
        this.runningCount++;
        promiseMaker().then(() => {
            this.runningCount--;
            if (this.callbacks.length > 0) {
                this.run(this.callbacks.shift());
            }
        });
    }
}

const scheduler = new Scheduler(2);
const addTask = (time, text) => {
    const promiseMaker = () => new Promise(resolve => {
        setTimeout(() => {
            console.log(text);
            resolve();
        }, time);
    });
    scheduler.add(promiseMaker);
};
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

// 最终打印 2 3 1 4