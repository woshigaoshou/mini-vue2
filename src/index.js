import { initMixin } from './init';
import { lifecycleMixin } from './liftcycle';
import { renderMixin } from './render';
import { initGlobalApi } from './globalAPI.js';

function Vue (options) {
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
initGlobalApi(Vue);

export default Vue;
