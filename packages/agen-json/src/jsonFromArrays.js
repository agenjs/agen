import { GetterSetterBuilder } from './GetterSetterBuilder';

function getHandler(handler) {
  if (typeof handler === 'string') handler = { field : handler };
  if (typeof handler === 'function') handler = { set : handler };
  if (typeof handler !== 'object') return null;
  if (typeof handler.set !== 'function' && handler.field) {
    const b = new GetterSetterBuilder();
    handler.set = b.newSetter(handler.field);
  }
  if (handler.split) {
    const delimiter = typeof handler.split !== 'boolean'
      ? handler.split
      : /\s*[;,]\s*/gim;
    handler.process = (v) => ('' + v).split(delimiter);
  }
  if (typeof handler.process !== 'function') handler.process = (v)=>v;
  return handler;
}

export async function* jsonFromArrays(provider, options = {}) {
  let { headersLine = 0, dataLine = 1, mapping } = options;
  let headers;
  let line = 0
  for await (let data of provider) {
    if (!data) continue ;
    if (line === headersLine) {
        headers = [];
        for (let i = 0; i < data.length; i++) {
          let field = data[i];
          field = (mapping ? mapping[field] : field);
          if (!field) continue;
          let handler = getHandler(field);
          if (handler) {
            headers.push(Object.assign({}, handler, { index : i }));
          }
        }
      } else if (headers && line >= dataLine) {
        let obj = {};
        for (let i = 0; i < headers.length; i++) {
          const h = headers[i];
          const value = h.process(data[h.index]);
          h.set(obj, value);
        }
        yield obj;
      }
      line++;
    }
}
