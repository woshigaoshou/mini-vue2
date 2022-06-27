import { parseHTML, ELEMENT_TYPE, TEXT_TYPE } from './parse';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 生成属性
function genProps (attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    // style另外判断处理
    if (attr.name === 'style') {
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  // props用对象包裹
  return `{${str.slice(0, -1)}}`;
}

function genChildren (children) {
  return children.map(child => gen(child)).join(',');
}

function gen (node) {
  if (node.type === ELEMENT_TYPE) {
    // 继续创建元素
    return generate(node);
  } else {
    const { text } = node;
    // 纯文本
    if (!defaultTagRE.test(text)) {
      console.log(1);
      
      // _v 表示创建文本vNode
      return `_v(${JSON.stringify(text)})`;
    } else {
      // 重置正则匹配lastIndex
      let lastIndex = defaultTagRE.lastIndex = 0;
      let match;
      let tokens = [];
      while (match = defaultTagRE.exec(text)) {
        const index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      // 最终匹配的位置不是length的位置，证明后面还有text文本
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join('+')})`;
    }
  }
}

function generate (ast) {
  let children = genChildren(ast.children);

  return `_c('${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : undefined}
    ${children.length ? `,${children}` : ''})`;
}

export function complieToFunctions (template) {
  let ast = parseHTML(template);
  console.log(ast);
  // 生成渲染函数
  const code = generate(ast);

  const renderFn = new Function(`with(this) {return ${code}}`);

  return renderFn;
}
