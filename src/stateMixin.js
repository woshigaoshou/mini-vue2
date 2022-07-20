import { nextTick } from './util/next-tick';
import Watcher from './watcher';

export function initStateMixin (Vue) {
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$watch = function (exprOrFn, handler, options = {}) {
    const vm = this;
    let watcher = new Watcher(vm, exprOrFn, handler, {...options, user: true});
    if (options.immediate) {
      // 立即执行
      cb.call(vm, watcher.value);
    }
  }
}
