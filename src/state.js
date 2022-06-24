import { observe } from './observe/index';

export function initState (vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function initData (vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data() : data || {};

  for (let key in data) {
    proxy(vm, '_data', key);
  }

  observe(data);
}

function proxy (target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get () {
      return target[sourceKey][key];
    },
    set (newVal) {
      target[sourceKey][key] = newVal;
    }
  });
}


