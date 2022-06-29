import { initState } from "./state"
import { complieToFunctions } from './complier/index.js';
import { mountComponent, callHook } from './liftcycle';
import { mergeOptions } from './util/options';

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    
    vm.$options = mergeOptions(vm.constructor.options, options);
    console.log(vm.$options);
    
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  
  Vue.prototype.$mount = function (el) {
    const options = this.$options;
    el = document.querySelector(el);
  
  
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
      }
  
      if (template) {
        const render = complieToFunctions(template);
        options.render = render;
      }
    }

    return mountComponent(this, el);
  }
}
