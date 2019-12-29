export async function* filter(provider, filter) {
  let idx = 0;
  for await (let value of provider) {
    if (await filter(value, idx++)) yield value;
  }
}
