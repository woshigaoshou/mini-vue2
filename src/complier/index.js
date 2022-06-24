import { parseHTML, ELEMENT_TYPE, TEXT_TYPE } from './parse';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps (attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      const obj = {};
      attr.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `'${attr.name}':"${attr.value}",`
  }
  str = str.slice(0, -1);
  return str;
}

function genChildren (children) {
  return children.map(child => gen(child)).join(',');
}

function gen (node) {
  
}

function codegen (ast) {
  console.log(ast);
  let code = `_c'${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : ''},${ast.children.length ? genChildren(ast.children) : null}`;
  console.log(code);
  
}

export function complieToFunctions (template) {
  let ast = parseHTML(template);
  console.log(ast);
  const render = codegen(ast);
  console.log(render);
  
}
