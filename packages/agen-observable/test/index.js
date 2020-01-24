const { setGlobal } = require('@agen/ns');

describe('zen-observable', () => {
  const Observable = require('zen-observable');
  setGlobal('Observable', Observable);
  require('./ObservableTest')(Observable);
  require('./observableTest')();
  require('./subscribeTest')();
})

describe('Local Observable', () => {
  const { Observable } = require('../');
  setGlobal('Observable', Observable);
  require('./ObservableTest')(Observable);
  require('./observableTest')();
  require('./subscribeTest')();
})
