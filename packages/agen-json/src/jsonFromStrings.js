export async function* jsonFromStrings(provider) {
  for await (let line of provider) {
    try {
      yield JSON.parse(line);
    } catch (error) {
      yield { error };
    }
  }
}
