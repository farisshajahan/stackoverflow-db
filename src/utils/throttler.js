const throttler = (maxCallsPerInterval, intervalTime) => {
  let numRunning = 0;
  let startTime = 0;
  const queue = [];
  let schedulerRunning = false;

  const dequeue = async () => {
    queue.splice(0, maxCallsPerInterval - numRunning).forEach((fn) => {
      numRunning += 1;
      fn();
    });
  };

  const runScheduler = async () => {
    schedulerRunning = true;
    const now = Date.now();
    if (queue.length) {
      if (now > intervalTime + startTime) {
        numRunning = 0;
        startTime = now;
      }
      if (!numRunning) startTime = now;
      if (numRunning < maxCallsPerInterval) dequeue();
      setTimeout(runScheduler, (intervalTime + startTime - now + 1) * 1000);
      return;
    }
    numRunning = 0;
    schedulerRunning = false;
  };

  const enqueue = (callback) =>
    new Promise((resolve, reject) => {
      const promise = () => Promise.resolve().then(callback).then(resolve).catch(reject);
      queue.push(promise);
      if (!schedulerRunning) {
        startTime = Date.now();
        runScheduler();
      }
      dequeue();
    });

  return enqueue;
};

export default throttler;
