import { withStreamData } from './withStreamData';
import { observe } from '@agen/observable';
import { streamToPromise } from './streamToPromise';

export async function* streamToGenerator(stream) {
  yield* observe((observer) => {
    let promise = (async () => {
      try {
        await streamToPromise(withStreamData(stream, observer.next));
        await observer.complete();
      } catch (err) {
        await observer.error(err);
      }
    })();
    return async (error) => {
      let m, args=[];
      if (stream.destroy) { m = stream.destroy; args.push(error); } else { m = stream.close; }
      if (m) await new Promise(cb => (args.push(cb), m.apply(stream, args)));
      await promise;
      // if (error) throw error;
    }
  })
}
