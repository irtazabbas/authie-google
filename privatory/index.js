
module.exports = function() {
  // This establishes a private namespace.
  const namespace = new WeakMap();
  return function p(object, dontSet) {
    if (!namespace.has(object) && !dontSet) namespace.set(object, {});
    return namespace.get(object);
  }
}
