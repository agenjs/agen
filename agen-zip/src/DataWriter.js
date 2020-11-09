import { DataAccessor } from './DataAccessor';
import * as ieee754 from './ieee754';

export class DataWriter extends DataAccessor {

  writeUIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      this._checkInt(value, offset, byteLength, maxBytes, 0)
    }

    var mul = 1
    var i = 0
    this.data[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      this.data[offset + i] = (value / mul) & 0xFF
    }

    return offset + byteLength
  }

  writeUIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      this._checkInt(value, offset, byteLength, maxBytes, 0)
    }

    var i = byteLength - 1
    var mul = 1
    this.data[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      this.data[offset + i] = (value / mul) & 0xFF
    }

    return offset + byteLength
  }

  writeUInt8 (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 1, 0xff, 0)
    this.data[offset] = (value & 0xff)
    return offset + 1
  }

  writeUInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 2, 0xffff, 0)
    this.data[offset] = (value & 0xff)
    this.data[offset + 1] = (value >>> 8)
    return offset + 2
  }

  writeUInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 2, 0xffff, 0)
    this.data[offset] = (value >>> 8)
    this.data[offset + 1] = (value & 0xff)
    return offset + 2
  }

  writeUInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 4, 0xffffffff, 0)
    this.data[offset + 3] = (value >>> 24)
    this.data[offset + 2] = (value >>> 16)
    this.data[offset + 1] = (value >>> 8)
    this.data[offset] = (value & 0xff)
    return offset + 4
  }

  writeUInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 4, 0xffffffff, 0)
    this.data[offset] = (value >>> 24)
    this.data[offset + 1] = (value >>> 16)
    this.data[offset + 2] = (value >>> 8)
    this.data[offset + 3] = (value & 0xff)
    return offset + 4
  }

  writeIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      var limit = Math.pow(2, (8 * byteLength) - 1)
      this._checkInt(value, offset, byteLength, limit - 1, -limit)
    }

    var i = 0
    var mul = 1
    var sub = 0
    this.data[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this.data[offset + i - 1] !== 0) {
        sub = 1
      }
      this.data[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }

    return offset + byteLength
  }

  writeIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      var limit = Math.pow(2, (8 * byteLength) - 1)
      this._checkInt(value, offset, byteLength, limit - 1, -limit)
    }

    var i = byteLength - 1
    var mul = 1
    var sub = 0
    this.data[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this.data[offset + i + 1] !== 0) {
        sub = 1
      }
      this.data[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }

    return offset + byteLength
  }

  writeInt8 (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 1, 0x7f, -0x80)
    if (value < 0) value = 0xff + value + 1
    this.data[offset] = (value & 0xff)
    return offset + 1
  }

  writeInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 2, 0x7fff, -0x8000)
    this.data[offset] = (value & 0xff)
    this.data[offset + 1] = (value >>> 8)
    return offset + 2
  }

  writeInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 2, 0x7fff, -0x8000)
    this.data[offset] = (value >>> 8)
    this.data[offset + 1] = (value & 0xff)
    return offset + 2
  }

  writeInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 4, 0x7fffffff, -0x80000000)
    this.data[offset] = (value & 0xff)
    this.data[offset + 1] = (value >>> 8)
    this.data[offset + 2] = (value >>> 16)
    this.data[offset + 3] = (value >>> 24)
    return offset + 4
  }

  writeInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) this._checkInt(value, offset, 4, 0x7fffffff, -0x80000000)
    if (value < 0) value = 0xffffffff + value + 1
    this.data[offset] = (value >>> 24)
    this.data[offset + 1] = (value >>> 16)
    this.data[offset + 2] = (value >>> 8)
    this.data[offset + 3] = (value & 0xff)
    return offset + 4
  }

  writeFloatLE (value, offset, noAssert) {
    return this._writeFloat(value, offset, true, noAssert)
  }

  writeFloatBE (value, offset, noAssert) {
    return this._writeFloat(value, offset, false, noAssert)
  }

  _writeFloat (value, offset, littleEndian, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      this._checkIEEE754(value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
    }
    ieee754.write(this.data, value, offset, littleEndian, 23, 4)
    return offset + 4
  }

  writeDoubleLE (value, offset, noAssert) {
    return this._writeDouble(value, offset, true, noAssert)
  }

  writeDoubleBE (value, offset, noAssert) {
    return this._writeDouble(value, offset, false, noAssert)
  }

  _writeDouble(value, offset, littleEndian, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      this._checkIEEE754(value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
    }
    ieee754.write(this.data, value, offset, littleEndian, 52, 8)
    return offset + 8
  }

  _checkIEEE754(value, offset, ext, max, min) {
    if (max < min) throw new RangeError('max is less than min')
    if (offset + ext > this.data.length) throw new RangeError('Index out of range')
    if (offset < 0) throw new RangeError('Index out of range')
  }

  _checkInt (value, offset, ext, max, min) {
    // if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
    if (offset + ext > this.data.length) throw new RangeError('Index out of range')
  }

}
