export function withStreamData(stream, action, event = 'data')  {
  stream.on(event, async (d) => {
    try {
      stream.pause();
      await action(d);
      stream.resume();
    } catch (error) {
      (stream.destroy && stream.destroy(error)) || 
      (stream.close && (stream.emit('error', error), stream.close()))
    }
  })
  return stream;
}
