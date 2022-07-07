import { mergeOptions } from '../util/options';

export default function initExtend (Vue) {
  let cid = 0;
  Vue.extend = function (extendOptions) {
    // 全局挂载的组件是构造函数，组件内的只是一个普通对象
    const Sub = function VueComponent (options) {
      this._init(options);
    }
    Sub.cid = cid++;
    Sub.prototype = Object.create(this.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(this.options, extendOptions);
    return Sub;
  }
}
