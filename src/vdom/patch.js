export function patch (oldVnode, vnode) {
  // console.log(oldVnode);
  // 初次渲染时，传入的是真实dom，dom节点是具有nodeType属性的
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // console.log(isRealElement);
    const oldElm = oldVnode;
    const parentElm = oldVnode.parentNode;
    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling);
    parentElm.removeChild(oldElm);
    return el;
  } else {
    // 不同标签，直接替换
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);;
    }

    // 这里是相同标签，且无tag，证明两个都是文本
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        oldVnode.el.textContent = vnode.text;
      }
    }

    // 节点复用
    const el = vnode.el = oldVnode.el;
    updateProperties(vnode, oldVnode.data);
    const oldChild = oldVnode.children || [];
    const newChild = vnode.children || [];

    if (oldChild.length > 0 && newChild.length > 0) {
      updateChildren(el, oldChild, newChild);
    } else if (oldChild.length > 0) {
      el.innerHTML = '';
    } else if (newChild.length > 0) {
      for(let i = 0; i < newChild.length; i++) {
        el.appendChild(createElm(newChild[i]));
      }
    }
  }
}

function isSameVnode (oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}


function updateChildren (el, oldChild, newChild) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChild[0];
  let oldEndIndex = oldChild.length - 1;
  let oldEndVnode = oldChild[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChild[0];
  let newEndIndex = newChild.length - 1;
  let newEndVnode = newChild[oldEndIndex];

  console.log(newChild, oldChild, newEndIndex, newStartIndex);
  

  function makeIndexByKey (children) {
    let map = {};
    children.forEach((item, index) => {
      map[item.key] = index;
    });
    return map;
  }
  let map = makeIndexByKey(oldChild);

  while (oldEndIndex >= oldStartIndex && newEndIndex >= newStartIndex) {
    console.log(newStartVnode, newEndVnode, newStartIndex, newEndIndex);
    
    if (!oldStartVnode) {
      oldStartVnode = oldChild[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChild[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      console.log(0);

      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChild[++oldStartIndex];
      newStartVnode = newChild[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      console.log(1);

      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChild[--oldEndIndex];
      newEndVnode = newChild[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      console.log(2);

      patch(oldStartVnode, newEndVnode);
      // insertBefore可插入和移动dom
      // 两侧都相同，此时newElm还没生成，如：
      // old: a b c f
      // new: e d a f
      // 此时a应该插入到f的前面
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChild[++oldStartIndex];
      newEndVnode = newChild[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      console.log(3);
      
      patch(oldEndVnode, newStartVnode);
      // 两侧都相同，此时newElm还没生成，如：
      // old: e b c f
      // new: e c a f
      // 此时c应该插入到b的前面
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChild[--oldEndIndex];
      newStartVnode = newChild[++newStartIndex];
    } else {
      const moveIndex = map[newStartVnode.key];
      if (!moveIndex) {
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        let moveVnode = oldChild[moveIndex];
        // 置空，防止数组塌陷，索引不对应
        oldChild[moveIndex] = undefined;
        console.log(moveVnode, newStartVnode);
        
        el.insertBefore(moveVnode.el, oldStartVnode.el);
        patch(moveVnode, newStartVnode);
      }
      newStartVnode = newChild[++newStartIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    // debugger
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const childEl = createElm(newChild[i]);
      const anchor = newChild[newStartIndex + 1] ? newChild[newStartIndex + 1].el : null;
      el.insertBefore(childEl, anchor);
    }
  }

  if (oldStartIndex <=  oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChild[i];
      console.log(child);
      // 老节点置为undefined，此时需要跳过
      if (child) {
        el.removeChild(oldChild[i].el);
      }
    }
  }
}

// 创建真实DOM
export function createElm (vnode) {
  const { tag, data, key, children, text } = vnode;

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    // console.log(tag);
    
    updateProperties(vnode);
    children.forEach(child => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  // console.log(vnode);
  
  return vnode.el;
}

// 处理属性
function updateProperties (vnode, oldProps = {}) {
  const el = vnode.el;
  const props = vnode.data || {};

  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(k);
    }
  }

  const newStyle = props.style || {};
  const oldStyle = oldProps.style || {};

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = '';
    }
  }


  for (let key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else if (key === 'class') {
      el.className = props.class;
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
