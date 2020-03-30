export async function* handleFetchResults(res) {
  try {
    const body = res.body;
    if (typeof body.getReader === 'function') { // Browser
      const reader = body.getReader();
      let chunk;
      while ((chunk = await reader.read()) && !chunk.done) {
        yield chunk.value;
      }
    } else {
      yield* body;
    }
  } finally {
    if (typeof res.abort === 'function') res.abort();
  }
}
