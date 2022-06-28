import { nextTick } from '../util/next-tick';

let has = {};
let queue = [];
let pending = false;

// 利用队列，放到nextTick里，避免多次同步赋值时重复触发渲染
function flushSchedulerQueue () {
  debugger
  queue.forEach(wathcer => wathcer.run());
  pending = false;
  has = {};
  queue = [];
}

export function queueWatcher (watcher) {
  const id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    queue.push(watcher);
    if (!pending) {
      pending = true;
      debugger
      nextTick(flushSchedulerQueue);
    }
  }
}
