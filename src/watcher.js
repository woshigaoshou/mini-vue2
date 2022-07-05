// import Dep from './observe/dep';
import { pushTarget, popTarget } from './observe/dep';
import { queueWatcher } from './observe/scheduler';
import { isObject } from "./util/index";

let id = 0;

export default class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    this.vm = vm;
    if (typeof exprOrFn === 'string') {
      this.exprOrFn = vm[exprOrFn];
    } else {
      this.exprOrFn = exprOrFn;
    }
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.depIds = new Set();
    this.lazy = options.lazy;
    this.dirty = this.lazy; // 初始化为脏值
    this.user = options.user; // 用户自定义的watcher
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    } else {
      this.getter = function () {
        const path = exprOrFn.split('.');
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      }
    }
    this.value = this.lazy ? undefined : this.get();
  }
  get () {
    // 挂载全局变量，value为watcher实例
    pushTarget(this);
    // Dep.target = this;
    // 需要改变this执行，因为当前的this指向的是watcher实例，此时依赖属性收集到了computedWatcher，同时computedWatcher的deps也收集到了依赖
    const res = this.getter.call(this.vm);
    popTarget();
    // Dep.target = null;
    return res;
  }
  evaluate () {
    this.value = this.get();
    // 标志位false,实现缓存
    this.dirty = false;
  }
  depend () {
    const deps = this.deps;
    let i = deps.length;
    while (i--) {
      this.deps[i].depend(); // 所以计算属性本身是不收集watcher的
    }
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
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }
  run () {
    const newValue = this.get();
    const oldValue = this.value;
    if (this.user) {
      // 不相等或是对象时
      if (newValue !== oldValue || isObject(newValue)) {
        this.cb.call(this.vm, newValue, oldValue);
      }
    } else {
       // 重新渲染，重新收集依赖
      this.get();
    }
  }
}
