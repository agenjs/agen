const w = typeof window !== 'undefined' ? window : undefined;
const g = typeof global !== 'undefined' ? global : undefined;
export const ns = (w || g || {});
export function getGlobal(name) { return ns[name] }
export function setGlobal(name, value) { return ns[name] = value; }
