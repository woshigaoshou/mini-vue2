import { arrayMethods } from './array';
import Dep from './dep';

class Observer {
  constructor (data) {
    this.dep = new Dep();
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

function dependArray (value) {
  for (let i = 0; i < value.length; i++) {
    const e = value[i];
    // 深层嵌套的数组，在observe的时候都会赋予一个__ob__对象，此时调用depend，收集其父级的watcher
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

export function defineReactive (obj, key, val) {
  // 这里的observe不放在get里面是因为：只需要取一次，若改变了，在set里面重新赋值即可
  let childOb = observe(val);
  let dep = new Dep();
  // console.log(val, key);
  Object.defineProperty(obj, key, {
    get () {
      // console.log('取值了');
      // 收集依赖
      
      if (Dep.target) {
        // 收集属性的依赖
        dep.depend();
        // 只有对象和数组才有返回值
        if (childOb) { 
          // debugger
          // 收集对象或数组的依赖，这里的作用有两个
          // 1. 使用数组变异方法时，可以通过ob.dep进行notify
          // 2. 后续使用$set会用到该dep实例
          childOb.dep.depend();
          if (Array.isArray(val)) {
            dependArray(val);
          }
        }
      }
      
      return val;
    },
    set (newVal) {
      // console.log('赋值了', newVal);
      if (val === newVal) return;
      childOb = observe(newVal);
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
