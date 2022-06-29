let callbacks = [];
let waiting = false;

let timerFunc;

function flushCallbacks () {
  // 需要先置为false，否则cb内触发了渲染，渲染的watcher.run不会进入到队列中
  waiting = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  copies.forEach(cb => cb());
}

if (typeof Promise !== undefined) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  }
} else if (MutationObserver) {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });

  timerFunc = () => {
    counter = counter % 2 + 1;
    textNode.data = String(counter);
  }
} else if (setInterval) {
  timerFunc = () => {
    setInterval(flushCallbacks);
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}

export function nextTick (cb) {
  // console.log(cb);
  callbacks.push(cb);
  if (!waiting) {
    waiting = true;
    timerFunc();
  }
}
