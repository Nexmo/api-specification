module.exports = function (targetValue, options, paths, otherValues) {
  const list = Object.keys(targetValue);

  let errors = [];
  errors = errors.concat(assertBefore(list, "get", "post"));
  errors = errors.concat(assertBefore(list, "post", "patch"));
  errors = errors.concat(assertBefore(list, "patch", "put"));
  errors = errors.concat(assertBefore(list, "put", "delete"));
  return errors;
};

function assertBefore(list, a, b) {
  const aIndex = list.indexOf(a);
  const bIndex = list.indexOf(b);

  // If we don't have one of these entries, assume it's in order
  if (aIndex === -1 || bIndex === -1) {
    return [];
  }

  if (aIndex > bIndex) {
    return [
      {
        message: `'${a}' should be listed before '${b}' in {{path}}`,
      },
    ];
  }

  return [];
}
