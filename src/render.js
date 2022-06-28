import { createElement, createTextNode } from './vdom/index';
import { nextTick } from './util/next-tick';

export function renderMixin (Vue) {
  Vue.prototype._render = function () {
    // console.log('_render');
    const vm = this;
    // console.log(vm);
    
    const { render } = vm.$options;
    // console.log(render);
    
    const vnode = render.call(vm);
    return vnode;
  }
  Vue.prototype._c = function (...args) {
    // 创建虚拟dom
    return createElement(...args);
  }
  Vue.prototype._v = function (text) {
    return createTextNode(text);
  }
  Vue.prototype._s = function (val) {
    return val === null
      ? '' : typeof val === 'object'
        ? JSON.stringify(val) : val;
  }
  Vue.prototype.$nextTick = nextTick;
}
