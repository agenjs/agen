export async function* jsonToStrings(provider, eol = false) {
  let suffix = eol ? '\n' : '';
  for await (let obj of provider) {
    yield JSON.stringify(obj) + suffix;
  }
}
