module.exports =  class GetterSetterBuilder {

  newGetter(path) {
    path = this._toPath(path);
    let code = path.reduce((code, segment) => {
      segment = this._escape(segment);
      if (!segment) return code;
      return `${code}["${segment}"]`;
    }, '');
    code = `try{ return obj${code}; } catch (err) {}`;
    return new Function(['obj'], `"use strict";\n${code}`);
  }

  newSetter(path) {
    path = this._toPath(path);
    let code = 'obj = obj || {};\n';
    if (path.length) {
      code += `var o = obj;\n`;
      for (let i = 0; i < path.length; i++) {
        let segment = this._escape(path[i]);
        if (!segment) continue ;
        const next = `o["${segment}"]`;
        if (i < path.length - 1) {
          code += `o = ${next} = (typeof ${next} !== "object") ? {} : ${next}\n`;
        } else {
          code += `if (value === undefined) `;
          code += `{\n  delete ${next}; \n} else {\n  ${next} = value; \n}\n`;
        }
      }
    }
    code += `return obj;`
    return new Function(['obj', 'value'], `"use strict";\n${code}`);
  }

  newCloneSetter(path) {
    path = this._toPath(path);
    let code = `var newObj = Object.assign({}, obj || {});\n`;
    if (path.length) {
      code += `var o = newObj;\n`;
      for (let i = 0; i < path.length; i++) {
        let segment = this._escape(path[i]);
        if (!segment) continue ;
        const next = `o["${segment}"]`;
        if (i < path.length - 1) {
          code += `o = ${next} = (typeof ${next} === "object")\n`
            + `  ? Object.assign({}, ${next})\n`
            + `  : {};\n`
        } else {
          code += `if (value === undefined) `;
          code += `{\n  delete ${next}; \n} else {\n  ${next} = value; \n}\n`;
        }
      }
    }
    code += `return newObj;`
    return new Function(['obj', 'value'], `"use strict";\n${code}`);
  }

  _toPath(path) {
    if (!path)
      return [];
    if (typeof path === 'string')
      return path.split('.');
    return path;
  }

  _escape(segment) {
    segment = segment ? segment.trim() : '';
    return segment
      .replace(/(["'])/gim, '\\$1')
      .replace(/\r/gim, '\\r')
      .replace(/\n/gim, '\\n');
  }

}
