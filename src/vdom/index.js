import { isObject, isReservedTag } from '../util/index';

export class VNode {
  constructor (tag, data, key, children, text, componentOptions) {
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
    this.componentOptions = componentOptions;
  }
}

export function createComponentVnode (vm, tag, data, key, children, text, Ctor) {
  // 组件里的不是构造函数，需要重新包装
  if (isObject(Ctor)) {
    // 因为合并了options，所以在$options也能找到_base
    console.log(vm.$options._base.extend, Ctor);
    debugger
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init (vnode) {
      let child = vnode.componentInstance = new Ctor({ _isComponent: true });
      child.$mount();
    }
  }

  return new VNode(
    `vue-component-${Ctor.cid}-${tag}`,
    data,
    key,
    children,
    undefined,
    {
      Ctor,
    }
  );
}

export function createElement (vm, tag, data = {}, ...children) {
  let key = data.key;
  delete data.key;

  if (isReservedTag(tag)) {
    return new VNode(tag, data, key, children);
  } else {
    // console.log(tag, vm.$options, vm.$options.components[tag]);
    
    let Ctor = vm.$options.components[tag];
    return createComponentVnode(vm, tag, data, key, children, undefined, Ctor)
  }
}

export function createTextNode (text) {
  return new VNode(undefined, undefined, undefined, undefined, text);
}


