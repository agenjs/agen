export async function* map(provider, map) {
  let idx = 0;
  for await (let value of provider) {
    yield await map(value, idx++);
  }
}
