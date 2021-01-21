  module.exports = ({ trace = (()=>{}),  } = {}) => {
    let counter = 0;
    return {
    package: 'grpc.gateway.testing',
    services : {
      EchoService : {

        async noOp(request) {
          trace(`[NoOp]`, request);
        },

        async echo(request) {
          trace('[Echo]', request);
          return { message : request.message, message_counter : ++counter };
        },

        async echoAbort(request) {
          trace('[EchoAbort]', request);
          throw new Error('Hello - ' + request.message);
        },

        async* halfDuplexEcho(it) {
          const list = [];
          let counter = 0;
          for await (let item of it) {
            trace('[HalfDuplexEcho] Recieve', item);
            list.push({ ...item, counter });
            counter++;
          }
          for (let item of list) {
            const reply = { ...item, message: `Re: ${item.message}` };
            trace('[HalfDuplexEcho] Send', reply);
            yield reply;
            await new Promise(y => setTimeout(y, 100));
          }
        },

        async* serverStreamingEcho(request) {
          trace('[HalfDuplexEcho] Recieve', request);
          for (let i = 0; i < request.message_count; i++) {
            const reply = { message: `Re:${request.message} - ${i}` };
            trace('[HalfDuplexEcho] Send', reply);
            yield reply;
          }
        },

        async* fullDuplexEcho(it) {
          let stop = false, notify, promise = new Promise(r => notify = r);
          try {
            let lastMessage;
            (async () => {
              for await (let item of it) {
                trace('[FullDuplexEcho] Recive', item);
                if (stop) break;
                lastMessage = item.message;
                await new Promise(r => setTimeout(r, 10));
                notify();
              }
            })();
            await promise;
            let message_count = 0;
            for (let i = 0; i < 6; i++) {
              const reply = { message: lastMessage + ' - replay', message_count: message_count++ };
              trace('[FullDuplexEcho] Reply', reply);
              yield reply;
              await new Promise(r => setTimeout(r, 10));
            }
          } finally {
              stop = true;
          }
        }

      }
    }
  }
}