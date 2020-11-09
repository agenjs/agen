class DataViewCursor {
  constructor(buf, littleEndian) {
    this.data = new DataView(buf);
    this.offset = 0;
    this.littleEndian = !(!littleEndian);
  }
  get length() { return this.data.byteLength }
  reset() { this.offset = 0; }
  readBytes(len) {
    len = Math.min(len, this.length - this.offset);
    const buf = this.data.buffer;
    const shift = this.data.byteOffset + this.offset;
    return new Uint8Array(buf, shift, len);
  }
  readString(len) {
    let str = '';
    for (let i = 0; i < len; i++) {
      const v = this.readUint8();
      str += String.fromCharCode(v);
    }
    return str;
  }
}

['readBigInt64',
'readBigUint64',
'readFloat32',
'readFloat64',
'readInt16',
'readInt32',
'readInt8',
'readUint16',
'readUint32',
'readUint8',
'writeBigInt64',
'writeBigUint64',
'writeFloat32',
'writeFloat64',
'writeInt16',
'writeInt32',
'writeInt8',
'writeUint16',
'writeUint32',
'writeUint8'].forEach(name => {
  // Length of this type in bytes
  const delta = parseInt(name.replace(/^.*?(\d+)$/, '$1')) / 8;
  if (name.indexOf('read') === 0) {
    const fname = name.replace(/^read/, 'get');
    DataViewCursor.prototype[name] = function() {
      const value = this.data[fname](this.offset, this.littleEndian);
      this.offset += delta;
      return value;
    }
  } else {
    const fname = name.replace(/^write/, 'set');
    DataViewCursor.prototype[name] = function(value) {
      this.data[fname](value, this.offset, this.littleEndian);
      this.offset += delta;
      return this;
    }
  }
})


module.exports = DataViewCursor;
