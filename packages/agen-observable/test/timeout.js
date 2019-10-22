module.exports = function(t = 100) {
  return new Promise(r => setTimeout(r, t));
}
