const d3dsv = require('d3-dsv');

module.exports = async function* arraysToDsv(provider, options = {}) {
  const { delimiter = ';' } = options;
  const xsv = d3dsv.dsvFormat(delimiter);
  for await (let array of provider) {
    yield xsv.formatRows([array])
  }
}
