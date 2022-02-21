const throttler = (maxCallsPerInterval, intervalTime) => {
  let numRunning = 0;
  let startTime = Date.now();
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
    if (queue.length) {
      const now = Date.now();
      if (now > intervalTime + startTime) {
        numRunning = 0;
        startTime = Date.now();
      }
      if (numRunning < maxCallsPerInterval) dequeue();
      else setTimeout(runScheduler, (intervalTime + startTime - now + 1) * 1000);
    }
    schedulerRunning = false;
  };

  const enqueue = async (callback) =>
    new Promise((resolve, reject) => {
      const promise = () => Promise.resolve().then(callback).then(resolve).catch(reject);
      queue.push(promise);
      if (!schedulerRunning) runScheduler();
    });

  return enqueue;
};

export default throttler;
