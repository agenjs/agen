import { fetchWithAbort } from './fetchWithAbort';
import { handleFetchResults } from './handleFetchResults';

export async function* fetchData(url, params = {}) {
  const res = await fetchWithAbort(url, params);
  yield* handleFetchResults(res);
}
