import { arrayMethods } from './array'


class Observer {
  constructor (data) {
    def(data, '__ob__', this);
    console.log(data);
    
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  walk (data) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(data, keys[i], data[keys[i]]);
    }
  }
  observeArray (items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}

export function def (target, key, val, enumerable) {
  Object.defineProperty(target, key, {
    value: val,
    enumerable: !!enumerable,
    configurable: true,
    writable: true,
  });
}

export function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    get () {
      console.log('取值了');
      observe(val);
      
      return val;
    },
    set (newVal) {
      console.log('赋值了', newVal);
      observe(val);
      val = newVal;
    }
  })
}

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

function observe (data) {
  if (typeof data !== 'object' || data === null) return;

  return new Observer(data);
}
