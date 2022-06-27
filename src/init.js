import { initState } from "./state"
import { complieToFunctions } from './complier/index.js';
import { mountComponent } from './liftcycle';

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    initState(vm);

    if (vm.$options.el) {
      console.log(vm);
      
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
