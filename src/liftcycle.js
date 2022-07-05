import { patch } from './vdom/patch';
import Watcher from './watcher';

export function initLifecycle (Vue) {
  Vue.prototype._update = function (vnode) {
    // console.log('_update');
    const vm = this;
    const el = vm.$el;
    // 保存之前的vnode
    let prevVnode = vm._vode;
    vm._vode = vnode;
    // console.log(el);
    // 这里要重新赋值$el，否则每次更新都取到初始的$el导致parentNode为null，报错
    if (!prevVnode) {
      vm.$el = patch(el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  }
}

export function mountComponent (vm, el) {
  // console.log(vm);
  vm.$el = el;
  const updateComponent = function () {
    vm._update(vm._render());
  }
  const watcher = new Watcher(vm, updateComponent, () => {}, true);
  // console.log('------------------');
  
  // console.log(watcher);
}

export function callHook (vm, hook) {
  const handler = vm.$options[hook];
  if (handler) {
    for (let i = 0; i < handler.length; i++) {
      handler[i].call(vm);
    }
  }
}
