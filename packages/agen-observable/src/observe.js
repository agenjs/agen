const Observable = require('./Observable');
const observableToGenerator = require('./observableToGenerator');

module.exports = function observe(initialize, fifo = []) {
  return observableToGenerator(new Observable(initialize), fifo);
}
