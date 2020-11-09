const { DataReader, DataWriter, ieee754 } = require('..');
const { getIterator, slicer } = require('@agen/utils');
const { inflate } = require('@agen/gzip');
const DataViewCursor = require('./DataViewCursor');


module.exports = class ZipParser {
  constructor(options) {
    this.options = options;
  }

  async* _iterate(len) {
    for await (let block of this._provider(len)) {
      yield new Uint8Array(block);
    }
  }

  async _readBytes(len) {
    const result = new Uint8Array(len);
    let shift = 0;
    const it = this._iterate(len);
    for await (let array of it) {
      result.set(array, shift);
      shift += array.length;
    }
    return new DataViewCursor(result.buffer, true);
  }

  async* parseZip(it, listener) {
    this._listener = listener;
    this._provider = slicer(it);
    try {
      for await (let entry of await this._readRecord()) {
        yield entry;
      }
    } finally {
      delete this._listener;
      delete this._provider
    }
  }

  async* _readRecord() {
    while (true) {
      console.log('BEGIN');
      let data = await this._readBytes(4);
      if (!data.length) break ;
      const signature = data.readUint32();
      if (signature === 0x04034b50) {
        yield* this._readFile();
      } else if (signature === 0x02014b50) {
        yield* this._readCentralDirectoryFileHeader();
      } else if (signature === 0x06054b50) {
        await this._readEndOfCentralDirectoryRecord();
        break;
      } else {
        throw new Error('invalid signature: 0x' + signature.toString(16));
      }
      console.log('END');
    }
  }

  _getBasicFileInfo(data) {
    const properties = {};
    properties.versionsNeededToExtract = data.readUint16();
    properties.flags = data.readUint16();
    properties.compressionMethod = data.readUint16();
    properties.lastModifiedTime = data.readUint16();
    properties.lastModifiedDate = data.readUint16();
    properties.crc32 = data.readUint32();
    properties.compressedSize = data.readUint32();
    properties.uncompressedSize = data.readUint32();
    properties.fileNameLength = data.readUint16();
    properties.extraFieldLength = data.readUint16();
    return properties;
  }

  async* _readFile() {
    // https://en.wikipedia.org/wiki/Zip_(file_format)#Local_file_header
    // 0	4	Local file header signature = 0x04034b50 (read as a little-endian number)
    // 4	2	Version needed to extract (minimum)
    // 6	2	General purpose bit flag
    // 8	2	Compression method
    // 10	2	File last modification time
    // 12	2	File last modification date
    // 14	4	CRC-32 of uncompressed data
    // 18	4	Compressed size
    // 22	4	Uncompressed size
    // 26	2	File name length (n)
    // 28	2	Extra field length (m)
    // 30	n	File name
    // 30+n	m	Extra field
    let data = await this._readBytes(26);
    const properties = this._getBasicFileInfo(data);
    const filePath = await this._readString(properties.fileNameLength);
    const extraField = await this._readString(properties.extraFieldLength);
    const { flags, size, compressedSize, compressionMethod, lastModifiedDate, lastModifiedTime } = properties;
    const isDirectory = (compressedSize === 0 && /[\/\\]$/.test(filePath));
    const fileEntry = {
      path : filePath,
      type : isDirectory ? 'Directory' : 'File',
      properties : { size, compressedSize, lastModifiedDate, lastModifiedTime }
    }
    if (isDirectory) {
      fileEntry.data = (async function*() {})();
    } else if (compressionMethod === 0) {
      // File uncompressed
      fileEntry.data = this._provider(compressedSize);
    } else {
      if ((flags & 0x01) === 0x01) {
        // TODO: handle encrypted
      }

      const fileSizeKnown = !(flags & 0x08);
      if (fileSizeKnown) {
        fileEntry.data = inflate(this._provider(compressedSize));
        yield fileEntry;
      } else {
        const descriptorSig = 0x08074b50; // In little endian
        const sig = [0x50, 0x4b, 0x05, 0x06]; // ???

        bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06

        //       var matchStream = new MatchStream({ pattern: descriptorSig }, function (buf, matched, extra) {
        //         if (hasEntryListener) {
        //           if (!matched) {
        //             return this.push(buf);
        //           }
        //           this.push(buf);
        //         }
        //         setImmediate(function() {
        //           self._pullStream.unpipe();
        //           self._pullStream.prepend(extra);
        //           self._processDataDescriptor(entry);
        // }
      }
    }
    // for await (let block of fileEntry.data) {
    // }
    // try {
    //   yield fileEntry;
    // } finally {
    //   // Drain content
    //   for await (let buf of fileEntry.data) { /* */ }
    // }
  }

  async* _readCentralDirectoryFileHeader() {
    let data = await this._readBytes(42);
    const versionMadeBy = data.readUint16();
    const properties = this._getBasicFileInfo(data);
    properties.fileCommentLength = data.readUint16();
    properties.diskNumber = data.readUint16();
    properties.internalFileAttributes = data.readUint16();
    properties.externalFileAttributes = data.readUint32();
    properties.offsetToLocalFileHeader = data.readUint32();

    properties.fileName = await this._readString(properties.fileNameLength);
    properties.extraFields = await this._readExtraField(properties);
    properties.fileComment = await this._readString(properties.fileCommentLength);

    // const fileEntry = await this._newFileEntry(properties);
    // try {
    //   yield fileEntry;
    // } finally {
    //   // Drain content
    //   for await (let buf of fileEntry.data) { /* */ }
    // }
// console.log('>>> _readCentralDirectoryFileHeader', properties);
  }

  async _readEndOfCentralDirectoryRecord() {
    // https://en.wikipedia.org/wiki/Zip_(file_format)#End_of_central_directory_record_.28EOCD.29
    let data = await this._readBytes(18);
    const properties = {};
    properties.diskNumber = data.readInt16();
    properties.diskStart = data.readInt16();
    properties.numberOfRecordsOnDisk = data.readInt16();
    properties.numberOfRecords = data.readInt16();
    properties.sizeOfCentralDirectory = data.readInt32();
    properties.offsetToStartOfCentralDirectory = data.readInt16();

    properties.commentLength = data.readInt32();
    properties.comment = await this._readString(properties.commentLength);
// console.log('>>> _readEndOfCentralDirectoryRecord', properties);
  }


  async _readString(length) {
    const data = await this._readBytes(length);
    const str = data.readString(length);
    return str;
  }

}
