const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice',
];

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const original = arrayProto[method];
    original.apply(this, args);
    const ob = this.__ob__;

    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    console.log(method);
    
    if (inserted) ob.observeArray(inserted);
    
    ob.dep.notify();  // 通过Observer实例上的dep实例通知依赖，这样就不用取到上一层如：obj[key]: value， 可直接取value而不用obj[key]的方式通知了
  }
});
