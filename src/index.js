import { initMixin } from './init';
import { lifecycleMixin } from './liftcycle';
import { renderMixin } from './render';

function Vue (options) {
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;
