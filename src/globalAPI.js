import { mergeOptions } from './util/options';

export function initGlobalApi (Vue) {
  // 初始化全局options
  Vue.options = {};
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  }
}
