import * as meta from "./package.json";
import { default as configure }  from '../../rollup.configurator';
export default configure(meta, {
  external : [ 'buffer' ],
  global : { 'buffer' : 'buffer.Buffer' }
});
