export async function* jsonToArrays(provider, { headers } = {}) {
  for await (let obj of provider) {
    if (!headers) {
      headers = Object.keys(obj).sort();
      yield headers;
    }
    yield headers.map(key => obj[key]);
  }
}
