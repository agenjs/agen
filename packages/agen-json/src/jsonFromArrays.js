import { newHeaderHandlers } from './headerHandlers';

export async function* jsonFromArrays(provider, options = {}) {
  let { headers, headersLine = 0, dataLine = 0, mapping } = options;
  let handlers;
  if (headers) handlers = newHeaderHandlers(headers, mapping);
  if (!headers && !dataLine) dataLine = headersLine + 1;
  let line = -1;
  for await (let data of provider) {
    line++;
    if (!data) continue ;
    if (!handlers && line === headersLine) {
      handlers = newHeaderHandlers(data, mapping);
    } else if (handlers && line >= dataLine) {
      let obj;
      for (let i = 0; i < handlers.length; i++) {
        obj = handlers[i](obj, data, line);
      }
      if (obj !== undefined) yield obj;
    }
  }
}
