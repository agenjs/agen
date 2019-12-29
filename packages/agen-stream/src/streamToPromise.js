
// // First option:
// import { finished } from 'stream';
// import { promisify } from 'util';
// export const streamToPromise = promisify(finished);

// // Second option:
// const eos = require('end-of-stream');
// module.exports.streamToPromise = async function(stream) {
//   return new Promise((resolve, reject) => eos(stream, (err, result) => {
//     if (err) reject(err);
//     else resolve(result);
//   }))
// }
//

// // Third option:
export async function streamToPromise(stream) {
  let list = []
  function once(eventKey, action) {
    function handler(...args) {
      for (let i = 0; i < list.length; i++) list[i]();
      list = [];
      action(...args);
    }
    stream.on(eventKey, handler);
    list.push(() => stream.removeListener(eventKey, handler));
  }
  return new Promise((resolve, reject) => {
    try {
      once('finish', resolve);
      once('close', resolve);
      once('end', resolve);
      once('error', reject);
      // ??
      once('complete', resolve);
      once('abort', reject);
    } catch (err) {
      reject(err);
    }
  });
}
