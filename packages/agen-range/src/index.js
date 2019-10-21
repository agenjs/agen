module.exports = async function* range(provider, min = 0, count = Infinity) {
  let i = 0;
  for await (let v of provider) {
    if (i - min >= count) break;
    if (i >= min) yield v;
    i++;
  }
}
