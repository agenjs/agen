const expect = require('expect.js');
const { DataReader, DataWriter, ieee754 } = require('..');

describe('DataReader / DataWriter', async function() {

  const EPSILON = 0.00001

  it('read float', () => {
    const val = 42.42
    const buf = new ArrayBuffer(4);
    const writer = new DataWriter(buf);
    writer.writeFloatLE(val, 0);
    const num = ieee754.read(buf, 0, true, 23, 4)
    expect(Math.abs(num - val) < EPSILON).to.be(true);
  })

  it('write float', () => {
    const val = 42.42
    const buf = new ArrayBuffer(4);
    ieee754.write(buf, val, 0, true, 23, 4)
    const reader = new DataReader(buf);
    const num = reader.readFloatLE(0);
    expect(Math.abs(num - val) < EPSILON).to.be(true);
  })

  it('read double', () => {
    const value = 12345.123456789
    const buf = new ArrayBuffer(8);
    const writer = new DataWriter(buf);
    writer.writeDoubleLE(value, 0);
    const num = ieee754.read(buf, 0, true, 52, 8);
    expect(Math.abs(num - value) < EPSILON).to.be(true);
  })

  it('write double', () => {
    const value = 12345.123456789
    const buf = new ArrayBuffer(8);
    ieee754.write(buf, value, 0, true, 52, 8);
    const reader = new DataReader(buf);
    const num = reader.readDoubleLE(0);
    expect(Math.abs(num - value) < EPSILON).to.be(true);
  })

});
