import { dsvFormat } from 'd3-dsv';

export async function* arraysFromDsv(provider, options = {}) {
  const { delimiter = ';' } = options;
  const xsv = dsvFormat(delimiter);
  for await (let line of provider) {
    yield xsv.parseRows(line)[0] || []
  }
}
