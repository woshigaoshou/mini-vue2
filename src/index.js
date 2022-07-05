import { initMixin } from './init';
import { initLifecycle } from './liftcycle';
import { renderMixin } from './render';
import { initGlobalApi } from './globalAPI.js';
import { initStateMixin } from './stateMixin';
import { complieToFunctions } from './complier/index';
import { patch, createElm } from './vdom/patch';

function Vue (options) {
  this._init(options);
}

initMixin(Vue); // _init
renderMixin(Vue); // render
initLifecycle(Vue); // $mount, _update
initStateMixin(Vue); // nextTick $watch
initGlobalApi(Vue); // 全局api，如mixin

const vm1 = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3
  }
});
const tem1 = 
`<ul>
    <li key="a">{{a}}</li>
    <li key="b">{{b}}</li>
    <li key="c">{{c}}</li>
  </ul>`
// debugger
const render1 =  complieToFunctions(tem1);

const vnode1 = render1.call(vm1);
const el = createElm(vnode1);
console.log(el);

document.body.appendChild(el);

const vm2 = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  }
});

const tem2 =
`<ul>
    <li key="c">{{c}}</li>
    <li key="a">{{a}}</li>
    <li key="b">{{b}}</li>
    <li key="d">{{d}}</li>
  </ul>`
const render2 =  complieToFunctions(tem2);
const vnode2 = render2.call(vm2);

setTimeout(() => {
  patch(vnode1, vnode2);
}, 5000)

export default Vue;
