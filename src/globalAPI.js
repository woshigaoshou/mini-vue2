import { mergeOptions } from './util/options';
import Watcher from './watcher';

export function initGlobalApi (Vue) {
  // 初始化全局options
  Vue.options = {};
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  }
  Vue.prototype.$watch = function (exprOrFn, handler, options) {
    const vm = this;
    let watcher = new Watcher(vm, exprOrFn, handler, {...options, user: true});
    if (options.immediate) {
      // 立即执行
      cb.call(vm, watcher.value);
    }
  }
}
