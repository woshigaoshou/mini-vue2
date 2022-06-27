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

Dep.target = null;
