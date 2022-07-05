import { initMixin } from './init';
import { initLifecycle } from './liftcycle';
import { renderMixin } from './render';
import { initGlobalApi } from './globalAPI.js';
import { initStateMixin } from './stateMixin';

function Vue (options) {
  this._init(options);
}

initMixin(Vue); // _init
renderMixin(Vue); // render
initLifecycle(Vue); // $mount, _update
initStateMixin(Vue); // nextTick $watch
initGlobalApi(Vue); // 全局api，如mixin

export default Vue;
