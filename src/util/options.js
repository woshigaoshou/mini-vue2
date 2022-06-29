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

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

export function mergeOptions (parent, child) {
  // parent优先级大于child
  const options = {};
  for (let k in parent) {
    mergeField(k);
  }
  for (let k in child) {
    if (!parent.hasOwnProperty(k)) {
      mergeField(k);
    }
  }
  function mergeField (k) {
    if (strats[k]) {
      options[k] = strats[k](parent[k], child[k]);
    } else {
      options[k] = child[k] || parent[k];
    }
  }
  return options;
}
