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
  }
});
