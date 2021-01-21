import * as meta from "./package.json";
import { default as configure }  from '../../rollup.configurator';
export default configure(meta, {
  globals : {
    '*/pbf/package.json': { version: meta.devDependencies.pbf }
  }
});
