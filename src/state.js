import { observe } from './observe/index';
import Watcher from './watcher';
import Dep from './observe/dep';

export function initState (vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initWatch (vm) {
  const watch = vm.$options.watch;
  for (let k in watch) {
    const handler = watch[k];
    if (Array.isArray(handler)) {
      handler.forEach(handle => {
        createWatcher(vm, k, handle);
      });
    } else {
      createWatcher(vm, k, handler);
    }
  }
}

function createWatcher (vm, exprOrFn, handler, options = {}) {
  if (typeof handler === 'object') {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(exprOrFn, handler, options);
}

function initData (vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data() : data || {};

  for (let key in data) {
    proxy(vm, '_data', key);
  }

  observe(data);
}

function initComputed (vm) {
  const computed = vm.$options.computed;
  const watchers = vm._computedWatchers = {};
  for (let key in computed) {
    const useDef = computed[key];
    const getter = typeof useDef === 'function' ? useDef : useDef.get;
    console.log(getter);
    
    // new Watcher，放到_computedWatchers上
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });
    defineComputed(vm, key, useDef);
  }
}

// Computed本质上是一个具有lazy属性的watcher，通过Object,defineProperty进行拦截
function defineComputed (target, key, useDef) {
  // const getter = typeof useDef === 'function' ? useDef : useDef.get;
  const setter = useDef.set || (() => {});
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter,
  });
}

function createComputedGetter (key) {
  // getter的this指向为target，即vm
  return function () {
    const watcher = this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      // 若此时存在watcher，一般为渲染watcher，则调用depend方法，让其依赖属性收集该渲染watcher，从而达到依赖属性改变去通知依赖计算属性的渲染watcher的目的
      if (Dep.target) {
        watcher.depend();
      }
    }
    return watcher.value;
  }
}

function proxy (target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get () {
      return target[sourceKey][key];
    },
    set (newVal) {
      target[sourceKey][key] = newVal;
    }
  });
}
