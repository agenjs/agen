// Source: https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330
// Unmarshals an Uint8Array to string.
function decodeUTF8(bytes) {
    var s = '';
    var i = 0;
    while (i < bytes.length) {
        var c = bytes[i++];
        if (c > 127) {
            if (c > 191 && c < 224) {
                if (i >= bytes.length) throw 'UTF-8 decode: incomplete 2-byte sequence';
                c = (c & 31) << 6 | bytes[i] & 63;
            } else if (c > 223 && c < 240) {
                if (i + 1 >= bytes.length) throw 'UTF-8 decode: incomplete 3-byte sequence';
                c = (c & 15) << 12 | (bytes[i] & 63) << 6 | bytes[++i] & 63;
            } else if (c > 239 && c < 248) {
                if (i+2 >= bytes.length) throw 'UTF-8 decode: incomplete 4-byte sequence';
                c = (c & 7) << 18 | (bytes[i] & 63) << 12 | (bytes[++i] & 63) << 6 | bytes[++i] & 63;
            } else throw 'UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1);
            ++i;
        }

        if (c <= 0xffff) s += String.fromCharCode(c);
        else if (c <= 0x10ffff) {
            c -= 0x10000;
            s += String.fromCharCode(c >> 10 | 0xd800);
            s += String.fromCharCode(c & 0x3FF | 0xdc00);
        } else throw 'UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach';
    }
    return s;
}

function newUTF8Decoder(onChar, onError=(err)=>{throw err}) {
  let char, charLen = 1;
  return (c) => {
    if (charLen === 1) {
      if (c > 191 && c < 224) {
        char = (c & 31) << 6;
        charLen = 2;
      } else if (c > 223 && c < 240) {
        c = (c & 15) << 12;
        charLen = 3;
      } else if (c > 239 && c < 248) {
        char = (c & 7) << 18;
        charLen = 4;
      } else {
        char = c;
        charLen = 1;
      }
    } else {
      char |= (c & 63) << ((charLen - 2) * 6);
      charLen--;
    }
    if (charLen === 1) {
      if (char <= 0xffff) {
        onChar(String.fromCharCode(char));
      } else if (char <= 0x10ffff) {
          char -= 0x10000;
          onChar(String.fromCharCode(char >> 10 | 0xd800) +
               String.fromCharCode(char & 0x3FF | 0xdc00));
      } else {
        onError(new Error(`UTF-8 decode: code point 0x${char.toString(16)} exceeds UTF-16 reach`));
      }
    }
  }
}
