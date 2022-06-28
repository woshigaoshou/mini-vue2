import { patch } from './vdom/patch';
import Watcher from './watcher';

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    // console.log('_update');
    const vm = this;
    const el = vm.$el;
    console.log(el);
    // 这里要重新赋值$el，否则每次更新都取到初始的$el导致parentNode为null，报错
    vm.$el = patch(el, vnode)
  }
}

export function mountComponent (vm, el) {
  console.log(vm);
  vm.$el = el;
  const updateComponent = function () {
    vm._update(vm._render());
  }
  const watcher = new Watcher(vm, updateComponent, null, true);
  // console.log('------------------');
  
  console.log(watcher);
  
}
