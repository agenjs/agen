const d3dsv = require('d3-dsv');

module.exports = async function* arraysFromDsv(provider, options = {}) {
  const { delimiter = ';' } = options;
  const xsv = d3dsv.dsvFormat(delimiter);
  for await (let line of provider) {
    yield xsv.parseRows(line)[0] || []
  }
}
