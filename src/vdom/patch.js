export function patch (oldVnode, vnode) {
  console.log(oldVnode);
  // 初次渲染时，传入的是真实dom，dom节点是具有nodeType属性的
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    console.log(isRealElement);
    const oldElm = oldVnode;
    const parentElm = oldVnode.parentNode;
    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling);
    parentElm.removeChild(oldElm);
    return el;
  } else {
    
  }
}

// 创建真实DOM
function createElm (vnode) {
  const { tag, data, key, children, text } = vnode;

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    console.log(tag);
    
    updateProperties(vnode);
    children.forEach(child => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  console.log(vnode);
  
  return vnode.el;
}

// 处理属性
function updateProperties (vnode) {
  const el = vnode.el;
  const props = vnode.data || {};
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
