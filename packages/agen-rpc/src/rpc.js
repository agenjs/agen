import Pbf from 'pbf/dist/pbf-dev.js';
import compile from 'pbf/compile';
import schema from 'protocol-buffers-schema';

export {
  // wrapMethod,
  // wrapClientMethod,
  // wrapServerMethod,

  buildServiceStub,

  newServerHandler,
  newClientStub,

  parseSchema,
  visitAstMethods,
  newSerd,

  schema,
  compile,
  Pbf,
}

function getServiceMethodName(name) {
  return name[0].toLowerCase() + name.substring(1);
}

function buildServiceStub(ast, getMethod, options = {}) {
  const result = {};
  for (let info of visitAstMethods(ast, options)) {
    const method = getMethod(info);
    if (!method) continue;
    const service = result[info.serviceName] = result[info.serviceName] || {};
    service[info.methodName] = method;
  }
  return result;
}

function* visitAstMethods(ast, { getMethodName = getServiceMethodName } = {}) {
  const packageName = ast.package;
  for (let service of ast.services) {
    const serviceName = service.name;
    for (let method of service.methods) {
      const methodName = getMethodName(method.name);
      const requestStream = method.client_streaming;
      const responseStream = method.server_streaming;
      const requestType = method.input_type;
      const responseType = method.output_type;
      const methodInfo = {
        packageName, serviceName, methodName, name : method.name,
        requestStream, responseStream, 
        requestType, responseType,
        service, method, ast
      }
      yield methodInfo;
    }    
  }
}

function parseSchema(str) {
  return schema.parse(str);
}

function newSerd(ast) {
  const serializer = compile(ast);
  function newSerializer(type) {
    const write = serializer[type].write;
    return (req) => {
      const pbf = new Pbf();
      write(req, pbf);
      return pbf.finish();
    }
  }
  function newDeserializer(type) {
    const read = serializer[type].read;
    return (req) => {
      const pbf = new Pbf(req);
      return read(pbf);
    }
  }
  return { newSerializer, newDeserializer };
}

function newServerHandler(ast, getMethod) {
  const stub = buildServiceStub(ast, (methodInfo) => {
    const method = getMethod(methodInfo);
    const { requestStream, responseStream } = methodInfo;
    return () => {
      let notify, promise = new Promise(n => notify = n);
      const write = requestStream
        ? (input) => notify(input)
        : (input) => notify([input]);
      const read = responseStream
        ? async function* () { yield* await method(await promise); }
        : async function* () { yield await method(await promise); };
      return { read, write }
    }
  });
  return (methodInfo) => {
    const { serviceName, methodName } = methodInfo;
    return stub[serviceName][methodName]();
  }
}

function newClientStub(ast, openChannel) {
  return buildServiceStub(ast, (methodInfo) => {
    const { requestStream, responseStream } = methodInfo;
    return (input) => {
      const channel = openChannel(methodInfo);
      channel.write(requestStream ? input : [input]);
      const response = channel.read();
      if (responseStream) return response;
      return (async () => { for await (let message of response) { return message; } })();
    }
  });
}

// function wrapClientMethod(method, options) {
//   const { requestType, responseType, newSerializer, newDeserializer } = options;
//   const mapRequest = newSerializer(requestType);
//   const mapResponse = newDeserializer(responseType);
//   return wrapMethod(method, { ...options, mapRequest, mapResponse });
// }

// function wrapServerMethod(method, options) {
//   const { requestType, responseType, newSerializer, newDeserializer } = options;
//   const mapRequest = newDeserializer(requestType);
//   const mapResponse = newSerializer(responseType);
//   return wrapMethod(method, { ...options, mapRequest, mapResponse });
// }

// function wrapMethod(method, options) {
//   const noop = (v) => v;
//   const { requestStream, responseStream } = options;
//   let { mapRequest, mapResponse } = options;
//   mapRequest = mapRequest || noop;
//   mapResponse = mapResponse || noop;
//   const getRequest = requestStream ? mapIterator(mapRequest) : mapValue(mapRequest);
//   if (responseStream) {
//     const getResponse = mapIterator(mapResponse);
//     return async function* (request) {
//       yield* await getResponse(await method(await getRequest(await request)));
//     }
//   } else {
//     const getResponse = mapValue(mapResponse);
//     return async function (request) {
//       return await getResponse(await method(await getRequest(await request)));
//     }
//   }
// }

// function mapValue(map) {
//   return async function (value) {
//     value = await value;
//     return map(value);
//   }
// }

// function mapIterator(map) {
//   return async function* (it) {
//     for await (let item of it) {
//       yield await map(item);
//     }
//   }
// }
