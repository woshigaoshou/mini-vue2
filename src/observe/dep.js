let id = 0;

export default class Dep {
  constructor () {
    this.id = id++;
    this.subs = [];
  }
  depend () {
    // target的作用：一个是防止重复添加，另一个是调用watcher的addDep，实现双向依赖
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  addSub (watcher) {
    this.subs.push(watcher);
  }
  notify () {
    this.subs.forEach(watcher => watcher.update());
  }
}

const targetStack  = [];
Dep.target = null;

// 当渲染watcher执行取值计算属性时，需要先保存渲染watcher，挂载computedWatcher，让依赖属性收集该commputedWatcher
export function pushTarget (watcher) {
  targetStack.push(watcher);
  Dep.target = watcher;
}

export function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
