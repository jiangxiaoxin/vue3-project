class TaskQueue {
  constructor() {
    // 1. 任务队列（存储任务ID）
    this.queue = [];
    // 正在处理的ID（防止重复处理）
    this.processingId = null;
    // 失败的ID集合
    this.failedIds = [];
    // 是否正在运行
    this.isRunning = false;

    this.results = []
  }

  // 4. 随时可以向队列添加新的任务ID
  add(taskId) {
    if (!this.queue.includes(taskId) && this.processingId !== taskId) {
      this.queue.push(taskId);
      console.log(`任务 ${taskId} 已加入队列`);
    }

    // 如果当前没有任务在执行，立即启动处理
    if (!this.isRunning) {
      this.start();
    }
  }

  // 启动队列处理
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.processNext();
  }

  // 模拟调用后台接口获取详情（返回Promise）
  fetchDetail(taskId) {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 随机模拟成功或失败（这里你可以改成真实接口）
        const success = Math.random() > 0.3; // 70% 成功率，可自行调整
        if (success) {
          console.log(`任务 ${taskId} 获取详情成功`);
          resolve({ id: taskId, data: `详情数据_${taskId}` });
        } else {
          reject(new Error(`任务 ${taskId} 获取详情失败`));
        }
      }, 500 + Math.random() * 500); // 500~1000ms 延迟
    });
  }

  // 带重试的处理函数（最多重试2次，即总共尝试3次）
  async executeWithRetry(taskId, retries = 2) {
    try {
      const result = await this.fetchDetail(taskId);
      return result; // 成功直接返回
    } catch (err) {
      if (retries > 0) {
        console.log(`任务 ${taskId} 失败，正在第 ${3 - retries} 次重试...`);
        return this.executeWithRetry(taskId, retries - 1);
      } else {
        // 全部失败
        console.error(`任务 ${taskId} 经过3次尝试后仍然失败`);
        this.failedIds.push(taskId);
        throw err;
      }
    }
  }

  // 处理下一个任务
  async processNext() {
    if (this.queue.length === 0) {
      // 队列为空，检查是否真的全部处理完了
      if (this.processingId === null) {
        this.isRunning = false;
        console.log('所有任务已处理完成！');
        if (this.failedIds.length > 0) {
          console.log('其中失败的任务ID：', this.failedIds);
        } else {
          console.log('全部任务成功！');
        }
      }
      return;
    }

    // 取出第一个任务
    this.processingId = this.queue.shift();

    try {
      const result = await this.executeWithRetry(this.processingId);
      this.results.push(result)
      // 成功后继续处理下一个
      this.processingId = null;
      this.processNext();
    } catch (err) {
      // 失败已在 executeWithRetry 中记录到 failedIds
      this.processingId = null;
      this.processNext(); // 继续下一个
    }
  }

  // 获取当前状态（调试用）
  getStatus() {
    return {
      queue: [...this.queue],
      processing: this.processingId,
      failed: [...this.failedIds],
      isRunning: this.isRunning,
      results: [...this.results]
    };
  }
}

// ==================== 使用示例 ====================

const queue = new TaskQueue();

// 模拟随时添加任务（时间不确定）
setTimeout(() => queue.add('A001'), 100);
setTimeout(() => queue.add('B002'), 800);
setTimeout(() => queue.add('C003'), 1500);
setTimeout(() => queue.add('D004'), 2000);
setTimeout(() => queue.add('E005'), 3000);
setTimeout(() => queue.add('F006'), 5000); // 很久以后才加进来
setTimeout(() => {
  queue.add('G007');
  queue.add('H008');
}, 8000);

// 随时可以再加
// setInterval(() => {
//   if (Math.random() > 0.7) {
//     const newId = 'T' + Date.now().toString(36);
//     queue.add(newId);
//   }
// }, 3000);

// 10秒后查看最终结果（实际运行时可以等自然结束）
setTimeout(() => {
  console.log('当前队列状态：', queue.getStatus());
}, 20000);