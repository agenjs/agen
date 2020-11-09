import { DataAccessor } from './DataAccessor';
import * as ieee754 from './ieee754';

// See https://github.com/feross/buffer/blob/master/index.js
export class DataReader extends DataAccessor {

  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  _checkOffset (offset, ext) {
    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
    if (offset + ext > this.data.length) throw new RangeError('Trying to access beyond buffer length')
  }

  readUIntLE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) this._checkOffset(offset, byteLength)

    var val = this.data[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this.data[offset + i] * mul
    }

    return val
  }

  readUIntBE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      this._checkOffset(offset, byteLength)
    }

    var val = this.data[offset + --byteLength]
    var mul = 1
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this.data[offset + --byteLength] * mul
    }

    return val
  }

  readUInt8 (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 1)
    return this.data[offset]
  }

  readUInt16LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 2)
    return this.data[offset] | (this.data[offset + 1] << 8)
  }

  readUInt16BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 2)
    return (this.data[offset] << 8) | this.data[offset + 1]
  }

  readUInt32LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 4)

    return ((this.data[offset]) |
            (this.data[offset + 1] << 8) |
            (this.data[offset + 2] << 16)) +
      (this.data[offset + 3] * 0x1000000)
  }

  readUInt32BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 4)

    return (this.data[offset] * 0x1000000) +
      ((this.data[offset + 1] << 16) |
       (this.data[offset + 2] << 8) |
       this.data[offset + 3])
  }

  readIntLE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) this._checkOffset(offset, byteLength)

    var val = this.data[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this.data[offset + i] * mul
    }
    mul *= 0x80

    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

    return val
  }

  readIntBE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) this._checkOffset(offset, byteLength)

    var i = byteLength
    var mul = 1
    var val = this.data[offset + --i]
    while (i > 0 && (mul *= 0x100)) {
      val += this.data[offset + --i] * mul
    }
    mul *= 0x80

    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

    return val
  }

  readInt8 (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 1)
    if (!(this.data[offset] & 0x80)) return (this.data[offset])
    return ((0xff - this.data[offset] + 1) * -1)
  }

  readInt16LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 2)
    var val = this.data[offset] | (this.data[offset + 1] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }

  readInt16BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 2)
    var val = this.data[offset + 1] | (this.data[offset] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }

  readInt32LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 4)

    return (this.data[offset]) |
      (this.data[offset + 1] << 8) |
      (this.data[offset + 2] << 16) |
      (this.data[offset + 3] << 24)
  }

  readInt32BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 4)

    return (this.data[offset] << 24) |
      (this.data[offset + 1] << 16) |
      (this.data[offset + 2] << 8) |
      (this.data[offset + 3])
  }

  readFloatLE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 4)
    return ieee754.read(this.data, offset, true, 23, 4)
  }

  readFloatBE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 4)
    return ieee754.read(this.data, offset, false, 23, 4)
  }

  readDoubleLE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 8)
    return ieee754.read(this.data, offset, true, 52, 8)
  }

  readDoubleBE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) this._checkOffset(offset, 8)
    return ieee754.read(this.data, offset, false, 52, 8)
  }

}
