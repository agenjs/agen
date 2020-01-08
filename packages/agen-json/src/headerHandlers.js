import { GetterSetterBuilder } from './GetterSetterBuilder';

export function newHeaderHandler(header, index) {
  if (!header) return ;
  if (typeof header === 'string') header = { index, field : header };
  if (typeof header === 'function') header = { index, set : header };
  if (typeof header !== 'object') return ;
  if (typeof header.set !== 'function' && header.field) {
    const b = new GetterSetterBuilder();
    header.set = b.newSetter(header.field);
  }
  if (header.split) {
    const delimiter = typeof header.split !== 'boolean'
      ? header.split
      : /\s*[;,]\s*/gim;
    header.process = (v) => ('' + v).split(delimiter);
  }
  if (typeof header.process !== 'function') header.process = (v)=>v;
  return (obj, data) => {
    obj = obj || {};
    const value = header.process(data[index], index, data);
    header.set(obj, value);
    return obj;
  }
}

export function newHeaderHandlers(headers, mapping) {
  if (!!mapping && typeof mapping === 'object') {
    const m = mapping;
    mapping = (f) => m[f];
  } else if (typeof mapping !== 'function') {
    mapping = (f) => f;
  }
  let handlers = [];
  for (let i = 0; i < headers.length; i++) {
    let handler = newHeaderHandler(mapping(headers[i], i, headers), i);
    if (handler) { handlers.push(handler); }
  }
  return handlers;
}
