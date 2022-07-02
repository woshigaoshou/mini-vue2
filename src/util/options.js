import { extend } from './index';

const strats = {};
const LIFTCYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
];
// 采用策略模式，按照是否匹配上策略，来决定使用策略或是默认处理方式
LIFTCYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
});

// 对象类型的option，采用的是extend方式，即先完成parentVal的赋值，之后取childVal的key直接对res[key]进行覆盖
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

strats.data = function (parentVal, childVal, vm) {
  // console.log(parentVal, childVal);
  
  return mergeData(
    typeof parentVal === 'function' ? parentVal.call(vm || this) : parentVal,
    typeof childVal === 'function' ? childVal.call(vm || this) : childVal,
  )
}

// 这里的逻辑和默认合并策略一样，childVal会直接覆盖parentVal的值
function mergeData (to = {}, from) {
  if (!from) return to;
  const keys = Object.keys(from);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // console.log(key, to, from);
    
    to[key] = from[key];
  }
  return to;
}

const defaultStrat = function (parentVal, childVal) {
  return childVal || parentVal;
}

export function mergeOptions (parent, child, vm) {
  // console.log(parent, child);
  
  // parent优先级大于child
  const options = {};
  // 若options存在mixins(嵌套)，则优先合并options.mixins
  // 所以最终组件权重 > 组件内mixins(由于是for循环向前遍历，多个mixins，越靠后权重越高) > mixins内的mixins > 全局mixin > 全局mixin嵌套的mixin
  if (child.mixins) {
    for (let i = 0; i < child.mixins.length; i++) {
      parent = mergeOptions(parent, child.mixins[i]);
    }
  }
  for (let k in parent) {
    mergeField(k);
  }
  for (let k in child) {
    if (!parent.hasOwnProperty(k)) {
      mergeField(k);
    }
  }
  function mergeField (k) {
    const strat = strats[k] || defaultStrat;
    options[k] = strat(parent[k], child[k], vm);
  }
  return options;
}
