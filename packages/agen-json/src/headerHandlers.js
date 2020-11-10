import { GetterSetterBuilder } from './GetterSetterBuilder';

export function newHeaderHandler(header, index, field) {
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
    const split = (v) => String(v).split(delimiter);
    if (header.process) {
      const p = header.process;
      header.process = (v, ...args) => p(split(v, ...args));
    } else {
      header.process = split;
    }
  }
  if (typeof header.process !== 'function') header.process = (v)=>v;
  return (obj, data) => {
    obj = obj || {};
    const value = header.process(data[index], index, data, field);
    header.set(obj, value, field);
    return obj;
  }
}

export function newHeaderHandlers(headers, mapping) {
  if (!!mapping && typeof mapping === 'object') {
    const m = mapping;
    mapping = (field) => m[field] || (('*' in m) ? m['*'] : { field });
  } else if (typeof mapping !== 'function') {
    mapping = (f) => f;
  }
  let handlers = [];
  for (let i = 0; i < headers.length; i++) {
    let handler = newHeaderHandler(mapping(headers[i], i, headers), i, headers[i]);
    if (handler) { handlers.push(handler); }
  }
  return handlers;
}
