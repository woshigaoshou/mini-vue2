import { patch } from './vdom/patch';
import Watcher from './watcher';

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    console.log('_update');
    const vm = this;
    const el = vm.$el;
    patch(el, vnode)
  }
}

export function mountComponent (vm, el) {
  vm.$el = el;
  const updateComponent = function () {
    vm._update(vm._render());
  }
  const watcher = new Watcher(vm, updateComponent, null, true);
  console.log('------------------');
  
  console.log(watcher);
  
}
