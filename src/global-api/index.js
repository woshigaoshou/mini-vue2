import { mergeOptions } from '../util/options';
import initExtend from './initExtend';
import initAssetRegisters from './asset';
const ASSETS_TYPE = ['component', 'filter', 'directive'];

export function initGlobalApi (Vue) {
  // 初始化全局options
  Vue.options = {};
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  }
  console.log(123);
  ASSETS_TYPE.forEach(type => {
    Vue.options[type + 's'] = {};
  });
  Vue.options._base = Vue;


  initExtend(Vue); // extend方法定义
  initAssetRegisters(Vue); // assets注册方法 包含组件 指令和过滤器
}
