const expect = require('expect.js');
const rpc = require('..');
const { codePointAt } = require('./echo.proto.js');

const proto = require('./echo.proto.js');
const newEchoService = require('./echo.service.js');

describe('rpc', async function() {

  const ast = rpc.parseSchema(proto);
  const serd = rpc.newSerd(ast);

  describe('serialization/deserialization', () => {

    it(`should contain newSerializer/newDeserializer methods`, () => {
      expect(typeof serd.newSerializer).to.be('function');
      expect(typeof serd.newDeserializer).to.be('function');
    });

    it(`should be able to generate serializers/deserializers for individual types`, () => {
      test('EchoRequest');
      test('EchoResponse');
      test('ServerStreamingEchoRequest');
      test('ServerStreamingEchoResponse');
      test('ClientStreamingEchoRequest');
      test('ClientStreamingEchoResponse');
      function test(name) {
        const s = serd.newSerializer(name);
        const d = serd.newDeserializer(name);
        expect(typeof s).to.be('function');
        expect(typeof d).to.be('function');
      }
    })

    it(`should be able to serialize/deserialize objects`, () => {
      test('EchoRequest', { message : 'Hello, world' });
      test('ServerStreamingEchoRequest', {
        message: 'Hello, world',
        message_count : 5, 
        message_interval : 1234,
        this_is_an_additional_field : { foo : 'bar' }
      }, {
        message: 'Hello, world',
        message_count: 5,
        message_interval: 1234
      });

      // Missing fields: set default values
      test('ServerStreamingEchoRequest', {
        message: 'Hello, world',
        this_is_an_additional_field: { foo: 'bar' }
      }, {
        message: 'Hello, world',
        message_count: 0,
        message_interval: 0
      });      

      function test(name, input, control) {
        if (!control) control = input;
        const s = serd.newSerializer(name);
        const d = serd.newDeserializer(name);
        const buf = s(input);
        expect(buf instanceof Uint8Array).to.be(true);
        const test = d(buf);
        expect(typeof test).to.eql('object');
        expect(test).to.eql(control);
      }
    })
  })

  describe('schema inspection', () => {

    it(`should visit schema methods`, () => {
      const list = [];
      for (let info of rpc.visitAstMethods(ast)) {
        const { packageName, name, serviceName, methodName, requestStream, responseStream, requestType, responseType } = info;
        list.push({ packageName, name, serviceName, methodName, requestStream, responseStream, requestType, responseType });
      }
      const control = [
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "echo",
          "name": "Echo",
          "requestStream": false,
          "responseStream": false,
          "requestType": "EchoRequest",
          "responseType": "EchoResponse"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "echoAbort",
          "name": "EchoAbort",
          "requestStream": false,
          "responseStream": false,
          "requestType": "EchoRequest",
          "responseType": "EchoResponse"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "noOp",
          "name": "NoOp",
          "requestStream": false,
          "responseStream": false,
          "requestType": "Empty",
          "responseType": "Empty"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "serverStreamingEcho",
          "name": "ServerStreamingEcho",
          "requestStream": false,
          "responseStream": true,
          "requestType": "ServerStreamingEchoRequest",
          "responseType": "ServerStreamingEchoResponse"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "serverStreamingEchoAbort",
          "name": "ServerStreamingEchoAbort",
          "requestStream": false,
          "responseStream": true,
          "requestType": "ServerStreamingEchoRequest",
          "responseType": "ServerStreamingEchoResponse"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "clientStreamingEcho",
          "name": "ClientStreamingEcho",
          "requestStream": true,
          "responseStream": false,
          "requestType": "ClientStreamingEchoRequest",
          "responseType": "ClientStreamingEchoResponse"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "fullDuplexEcho",
          "name": "FullDuplexEcho",
          "requestStream": true,
          "responseStream": true,
          "requestType": "EchoRequest",
          "responseType": "EchoResponse"
        },
        {
          "packageName": "grpc.gateway.testing",
          "serviceName": "EchoService",
          "methodName": "halfDuplexEcho",
          "name": "HalfDuplexEcho",
          "requestStream": true,
          "responseStream": true,
          "requestType": "EchoRequest",
          "responseType": "EchoResponse"
        }
      ];
      expect(list).to.eql(control);
    })
  });


  describe('service stub generation', () => {

    it(`should generate schema-based stubs`, () => {
      const echo = newEchoService();
      const getMethod = (info) => {
        const { serviceName, methodName, requestStream, responseStream } = info;
        return echo.services[serviceName][methodName];
      }
      const stub = rpc.buildServiceStub(ast, getMethod);

      expect(Boolean(stub)).to.be(true);
      expect(typeof stub).to.be('object');
      expect(typeof stub.EchoService).to.be('object');

      for (let key of Object.keys(echo.services.EchoService)) {
        expect(typeof stub.EchoService[key]).to.be('function');
      }
    });

    it(`should generate simple async methods (no streams)`, async () => {
      let traces = [];

      const echo = newEchoService({ trace : (...args) => traces.push(args) } );
      const getMethod = (info) => {
        const { serviceName, methodName, requestStream, responseStream } = info;
        return echo.services[serviceName][methodName];
      }
      const stub = rpc.buildServiceStub(ast, getMethod);

      let result = await stub.EchoService.noOp();
      expect(traces).to.eql([
        [`[NoOp]`, undefined]
      ]);
      expect(result).to.be(undefined);

      traces = [];
      result = await stub.EchoService.echo({ message: 'A' });
      expect(traces).to.eql([['[Echo]', { message: 'A' }]]);
      expect(result).to.eql({ message: 'A', message_counter : 1 });
      result = await stub.EchoService.echo({ message: 'B' });
      expect(traces).to.eql([['[Echo]', { message: 'A' }], ['[Echo]', { message: 'B' }]]);
      expect(result).to.eql({ message: 'B', message_counter: 2 });
    });


    it(`should use async generators for server-streamable methods`, async () => {
      let traces = [];

      const echo = newEchoService({ trace: (...args) => traces.push(args) });
      const getMethod = (info) => {
        const { serviceName, methodName, requestStream, responseStream } = info;
        return echo.services[serviceName][methodName];
      }
      const stub = rpc.buildServiceStub(ast, getMethod);

      let list = [];
      const request = { message : 'A', message_count : 3 };
      for await (let message of stub.EchoService.serverStreamingEcho(request)) {
        list.push(message);
      }
      expect(list.length).to.eql(request.message_count);
      expect(traces).to.eql([
        ['[HalfDuplexEcho] Recieve', { message: 'A', message_count: 3 }],
        ['[HalfDuplexEcho] Send', { message: 'Re:A - 0' }],
        ['[HalfDuplexEcho] Send', { message: 'Re:A - 1' }],
        ['[HalfDuplexEcho] Send', { message: 'Re:A - 2' }]
      ]);
      expect(list).to.eql([
        { message: 'Re:A - 0' },
        { message: 'Re:A - 1' },
        { message: 'Re:A - 2' } 
      ]);
    });    

    it(`should use async generators duplex streams`, async () => {
      let traces = [];

      const echo = newEchoService({ trace: (...args) => traces.push(args) });
      const getMethod = (info) => {
        const { serviceName, methodName, requestStream, responseStream } = info;
        return echo.services[serviceName][methodName];
      }
      const stub = rpc.buildServiceStub(ast, getMethod);

      const inputMessages = [
        { message: 'A' },
        { message: 'B' },
        { message: 'C' },
        { message: 'D' }
      ];
      const request = (async function*() {
        for (let msg of inputMessages) {
          yield msg;
          await new Promise(r => setTimeout(r, 10));
        }
      })();

      let list = [];
      for await (let message of stub.EchoService.fullDuplexEcho(request)) {
        list.push(message);
      }
      
      expect(traces).to.eql([
        ['[FullDuplexEcho] Recive', { message: 'A' }],
        ['[FullDuplexEcho] Reply', { message: 'A - replay', message_count: 0 }],
        ['[FullDuplexEcho] Recive', { message: 'B' }],
        ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 1 }],
        ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 2 }],
        ['[FullDuplexEcho] Recive', { message: 'C' }],
        ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 3 }],
        ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 4 }],
        ['[FullDuplexEcho] Recive', { message: 'D' }],
        ['[FullDuplexEcho] Reply', { message: 'D - replay', message_count: 5 }] 
     ]);
      expect(list).to.eql([
        { message: 'A - replay', message_count: 0 },
        { message: 'B - replay', message_count: 1 },
        { message: 'B - replay', message_count: 2 },
        { message: 'C - replay', message_count: 3 },
        { message: 'C - replay', message_count: 4 },
        { message: 'D - replay', message_count: 5 }        
      ]);
    });

  });



  describe('stubs with serialization/deserialization', () => {

    const fromIterator = (stream, value) => {
      return stream
        ? (async function* () { yield* await value; })()
        : (async function () { for await (let item of await value) { return item; } })()
    }

    // Specific signature to universal signature (async*/async*)
    function serverCallsAdapter(getMethod) {
      return (methodInfo) => {
        const { requestStream, responseStream } = methodInfo;
        const method = getMethod(methodInfo);
        return (input) => (async function* () {
          const params = fromIterator(requestStream, input);
          const response = await method(await params);
          responseStream ? (yield* response) : (yield response);
        })();
      }
    }

    // Universal signature (async*/async*) to specific signature
    function clientCallsAdapter(getMethod) {
      return (methodInfo) => {
        const { requestStream, responseStream } = methodInfo;
        const method = getMethod(methodInfo);
        return (input) => {
          const response = method(requestStream ? input : [input]);
          return fromIterator(responseStream, response);
        }
      }
    }


    async function* map(it, map) { for await (let item of it) { yield map(item); } }

    function newCallsEncoder(getMethod, mapRequest, mapResponse) {
      return (methodInfo) => {
        const method = getMethod(methodInfo);
        const encodeRequest = mapRequest(methodInfo.requestType);
        const encodeResponse = mapResponse(methodInfo.responseType);
        return (request) => map(method(map(request, encodeRequest)), encodeResponse);
      }
    }
    function toSerializedForm(getMethod, serd) {
      return newCallsEncoder(getMethod, serd.newSerializer, serd.newDeserializer);
    }
    function fromSerializeForm(getMethod, serd) {
      return newCallsEncoder(getMethod, serd.newDeserializer, serd.newSerializer);
    }

    function newHandler(ast, getMethod) {
      const index = rpc.buildServiceStub(ast, getMethod);
      return (methodInfo) => {
        const { serviceName, methodName } = methodInfo;
        return (input) => index[serviceName][methodName](input);
      }
    }

    it(`should generate client/server stubs exchanging data by channels`, async () => {
      let traces = [];
      const echo = newEchoService({ trace: (...args) => traces.push(args) });
      const getMethod = (info) => {
        const { serviceName, methodName, requestStream, responseStream } = info;
        return echo.services[serviceName][methodName];
      }
      
      let h;
      h = getMethod;
      h = serverCallsAdapter(h);
      h = fromSerializeForm(h, serd);
      const serverHandler = newHandler(ast, h);

      h = serverHandler;
      h = toSerializedForm(h, serd);
      h = clientCallsAdapter(h);
      const clientHandler = newHandler(ast, h); 
      const stub = rpc.buildServiceStub(ast, clientHandler);

      const inputMessages = [
        { message: 'A' },
        { message: 'B' },
        { message: 'C' },
        { message: 'D' }
      ];
      let request = (async function* () {
        for (let msg of inputMessages) {
          yield msg;
          await new Promise(r => setTimeout(r, 10));
        }
      })();

      let list = [];
      for await (let message of stub.EchoService.fullDuplexEcho(request)) {
        list.push(message);
      }

      expect(traces).to.eql([
        ['[FullDuplexEcho] Recive', { message: 'A' }],
        ['[FullDuplexEcho] Reply', { message: 'A - replay', message_count: 0 }],
        ['[FullDuplexEcho] Recive', { message: 'B' }],
        ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 1 }],
        ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 2 }],
        ['[FullDuplexEcho] Recive', { message: 'C' }],
        ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 3 }],
        ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 4 }],
        ['[FullDuplexEcho] Recive', { message: 'D' }],
        ['[FullDuplexEcho] Reply', { message: 'D - replay', message_count: 5 }]
      ]);
      expect(list).to.eql([
        { message: 'A - replay', message_count: 0 },
        { message: 'B - replay', message_count: 1 },
        { message: 'B - replay', message_count: 2 },
        { message: 'C - replay', message_count: 3 },
        { message: 'C - replay', message_count: 4 },
        { message: 'D - replay', message_count: 5 }
      ]);

      // ----------------------------------------
      list = []; traces = [];
      request = { message: 'A', message_count: 3 };
      for await (let message of stub.EchoService.serverStreamingEcho(request)) {
        list.push(message);
      }
      expect(list.length).to.eql(request.message_count);
      expect(traces).to.eql([
        ['[HalfDuplexEcho] Recieve', { message: 'A', message_count: 3, message_interval: 0 }],
        ['[HalfDuplexEcho] Send', { message: 'Re:A - 0' }],
        ['[HalfDuplexEcho] Send', { message: 'Re:A - 1' }],
        ['[HalfDuplexEcho] Send', { message: 'Re:A - 2' }]
      ]);
      expect(list).to.eql([
        { message: 'Re:A - 0' },
        { message: 'Re:A - 1' },
        { message: 'Re:A - 2' }
      ]);

    });

    // it(`should generate client/server stubs exchanging data by channels`, async () => {
    //   let traces = [];
    //   const echo = newEchoService({ trace: (...args) => traces.push(args) });
    //   const getMethod = (info) => {
    //     const { serviceName, methodName, requestStream, responseStream } = info;
    //     return echo.services[serviceName][methodName];
    //   }
    //   const serverHandler = rpc.newServerHandler(ast, getMethod);

    //   const stub = rpc.newClientStub(ast, serverHandler);

    //   const inputMessages = [
    //     { message: 'A' },
    //     { message: 'B' },
    //     { message: 'C' },
    //     { message: 'D' }
    //   ];
    //   const request = (async function* () {
    //     for (let msg of inputMessages) {
    //       yield msg;
    //       await new Promise(r => setTimeout(r, 10));
    //     }
    //   })();

    //   let list = [];
    //   for await (let message of stub.EchoService.fullDuplexEcho(request)) {
    //     list.push(message);
    //   }

    //   expect(traces).to.eql([
    //     ['[FullDuplexEcho] Recive', { message: 'A' }],
    //     ['[FullDuplexEcho] Reply', { message: 'A - replay', message_count: 0 }],
    //     ['[FullDuplexEcho] Recive', { message: 'B' }],
    //     ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 1 }],
    //     ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 2 }],
    //     ['[FullDuplexEcho] Recive', { message: 'C' }],
    //     ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 3 }],
    //     ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 4 }],
    //     ['[FullDuplexEcho] Recive', { message: 'D' }],
    //     ['[FullDuplexEcho] Reply', { message: 'D - replay', message_count: 5 }]
    //   ]);
    //   expect(list).to.eql([
    //     { message: 'A - replay', message_count: 0 },
    //     { message: 'B - replay', message_count: 1 },
    //     { message: 'B - replay', message_count: 2 },
    //     { message: 'C - replay', message_count: 3 },
    //     { message: 'C - replay', message_count: 4 },
    //     { message: 'D - replay', message_count: 5 }
    //   ]);
    // });    

    // function twist(openChannel) {
    //   return (...args) => {
    //     let notify, promise = new Promise(n => notify = n);
    //     const channel = openChannel();
    //     channel.write()
    //     return {
    //        write : (input) => notify(input),
    //        read  : async function* () { yield* (await promise); }
    //     }
    //   }
    // }


    // function mapChannel({ openChannel, onRead, onWrite }) {
    //   return (methodInfo) => {
    //     const channel = openChannel(methodInfo);
    //     const readMapper = onRead(methodInfo);
    //     const writeMapper = onWrite(methodInfo);
    //     async function* map(it, mapper) {
    //       for await (let message of it) {
    //         console.log('?', message, mapper(message));
    //         yield mapper(message);
    //       }
    //     }
    //     async function* read() { yield* map(channel.read(), readMapper); }
    //     async function write(input) { await channel.write(map(input, writeMapper)); }
    //     return { read, write };
    //   }
    // }

    // function serverSerializer(openChannel, serd) {
    //   return mapChannel({
    //     openChannel, 
    //     onRead : ({ requestType }) => serd.newDeserializer(requestType),
    //     onWrite : ({ responseType }) => serd.newSerializer(responseType),
    //   });
    // }

    // function clientSerializer(openChannel, serd) {
    //   return mapChannel({
    //     openChannel,
    //     onRead: ({ responseType }) => serd.newSerializer(responseType),
    //     onWrite: ({ requestType }) => serd.newDeserializer(requestType)
    //   });
    //   return mapChannel({
    //     openChannel,
    //     onRead: ({ responseType }) => serd.newSerializer(responseType),
    //     onWrite: ({ requestType }) => serd.newDeserializer(requestType)
    //   });
    // }
        
    // it(`should generate client/server stubs with data serialization/deserialization`, async () => {
    //   let traces = [];
    //   const echo = newEchoService({ trace: (...args) => traces.push(args) });
    //   let getMethod = (info) => {
    //     const { serviceName, methodName, requestStream, responseStream } = info;
    //     return echo.services[serviceName][methodName];
    //   }

    //   let openChannel;
    //   openChannel = rpc.newServerHandler(ast, getMethod);
    //   openChannel = serverSerializer(openChannel, serd);

    //   // openChannel = mapChannel({
    //   //   openChannel,
    //   //   onRead : (info) => (message) => {
    //   //     console.log('READ:', message);
    //   //     return message;
    //   //   },
    //   //   onWrite : (info) => (message) => {
    //   //     console.log('WRITE:', message);
    //   //     return message;
    //   //   }
    //   // });

    //   openChannel = clientSerializer(openChannel, serd);
    //   let stub = rpc.newClientStub(ast, openChannel);

    //   const inputMessages = [
    //     { message: 'A' },
    //     { message: 'B' },
    //     { message: 'C' },
    //     { message: 'D' }
    //   ];
    //   const request = (async function* () {
    //     for (let msg of inputMessages) {
    //       yield msg;
    //       await new Promise(r => setTimeout(r, 10));
    //     }
    //   })();

    //   let list = [];
    //   for await (let message of stub.EchoService.fullDuplexEcho(request)) {
    //     list.push(message);
    //   }

    //   expect(traces).to.eql([
    //     ['[FullDuplexEcho] Recive', { message: 'A' }],
    //     ['[FullDuplexEcho] Reply', { message: 'A - replay', message_count: 0 }],
    //     ['[FullDuplexEcho] Recive', { message: 'B' }],
    //     ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 1 }],
    //     ['[FullDuplexEcho] Reply', { message: 'B - replay', message_count: 2 }],
    //     ['[FullDuplexEcho] Recive', { message: 'C' }],
    //     ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 3 }],
    //     ['[FullDuplexEcho] Reply', { message: 'C - replay', message_count: 4 }],
    //     ['[FullDuplexEcho] Recive', { message: 'D' }],
    //     ['[FullDuplexEcho] Reply', { message: 'D - replay', message_count: 5 }]
    //   ]);
    //   expect(list).to.eql([
    //     { message: 'A - replay', message_count: 0 },
    //     { message: 'B - replay', message_count: 1 },
    //     { message: 'B - replay', message_count: 2 },
    //     { message: 'C - replay', message_count: 3 },
    //     { message: 'C - replay', message_count: 4 },
    //     { message: 'D - replay', message_count: 5 }
    //   ]);
    // });


  });


});
