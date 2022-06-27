import Dep from './observe/dep';

let id = 0;

export default class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.depIds = new Set();
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    }
    this.get();
  }
  get () {
    // 挂载全局变量，value为watcher实例
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }
  addDep (dep) {
    // 利用set进行去重
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  update () {
    // 重新渲染，重新收集依赖
    this.get();
  }
}
