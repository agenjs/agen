import { getGlobal } from '@agen/ns';

export async function fetchWithAbort(url, params) {
  const AbortController = getGlobal('AbortController');
  const fetch = getGlobal('fetch');

  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => (controller.abort(), {});
  if (typeof params === 'function') params = await params(abort);
  const res = await fetch(url, { ...params, signal });
  res.abort = abort;
  return res;
}
