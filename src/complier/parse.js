const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;

export const ELEMENT_TYPE = 1;
export const TEXT_TYPE = 3;

export function parseHTML (html) {
  const stack = [];
  let currentParent = null;
  let root = null;

  function createASTElement (tag, attrs) {
    return {
      tag,
      attrs,
      type: ELEMENT_TYPE,
      parent: null,
      children: [],
    };
  }

  function start (tag, attrs) {
    const node = createASTElement(tag, attrs);
    if (!root) root = node;
    if (currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }
    stack.push(node);
    currentParent = node;
  }
  function end () {
    stack.pop();
    currentParent = stack[stack.length - 1];
  }
  function chars (text) {
    text = text.replace(/\s/g, '');
    // console.log(currentParent);
    
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    });
  }

  function advance (n) {
    html = html.substring(n);
  }

  function parseStartTag () {
    const start = html.match(startTagOpen);
    // console.log(start);
    
    if (start) {
      const match = {
        tag: start[1],
        attrs: [],
      };
      advance(start[0].length);

      let attr,end;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
        // console.log(end, attr);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }

  function parseEndTag () {
    const end = html.match(endTag);
    advance(end[0].length)
    return end;
    // console.log(match);
  }


  let i = 10;
  while (html) {
    const textEnd = html.indexOf('<');

    // 查找的是标签
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tag, startTagMatch.attrs);
        continue
      }

      const endTagMatch = parseEndTag();
      if (endTagMatch) {
        end();
        // console.log(endTagMatch);
        continue
        
      }
    }

    // 查找的是文本
    if (textEnd > 0) {
      const text = html.substring(0, textEnd);
      chars(text);
      advance(text.length);
    }
  }
  return root;
}
