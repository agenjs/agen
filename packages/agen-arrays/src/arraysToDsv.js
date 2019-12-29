import { dsvFormat } from 'd3-dsv';

export async function* arraysToDsv(provider, options = {}) {
  const { delimiter = ';' } = options;
  const xsv = dsvFormat(delimiter);
  for await (let array of provider) {
    yield xsv.formatRows([array])
  }
}
