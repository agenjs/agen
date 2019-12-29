import * as meta from "./package.json";
import { default as configure }  from '../../rollup.configurator';
export default configure(meta, {
  globals : {
    'Buffer' : ['buffer', 'Buffer']
  },
  external : [ 'stream', 'buffer' ],
});
