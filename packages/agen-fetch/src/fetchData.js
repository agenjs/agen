import { fetchWithAbort } from './fetchWithAbort';

export async function* fetchData(url, params = {}) {
  const res = await fetchWithAbort(url, params);
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
    res.abort();
  }
}
