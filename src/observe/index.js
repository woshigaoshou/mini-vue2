import { arrayMethods } from './array';
import Dep from './dep';

class Observer {
  constructor (data) {
    def(data, '__ob__', this);
    
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
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    get () {
      console.log('取值了');
      // 收集依赖
      if (Dep.target) {
        dep.depend();
      }
      observe(val);
      
      return val;
    },
    set (newVal) {
      console.log('赋值了', newVal);
      observe(val);
      val = newVal;
      // 通知依赖，调用watcher.update
      dep.notify();
    }
  })
}

export function observe (data) {
  if (typeof data !== 'object' || data === null) return;

  return new Observer(data);
}
