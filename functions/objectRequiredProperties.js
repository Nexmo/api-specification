module.exports = function (targetValue, options, paths, otherValues) {
  if (!targetValue.required) {
    return;
  }

  for (let field of targetValue.required) {
    const p = targetValue.properties[field];

    // This can happen if you're using allOf as they're not resolved
    // when the rule runs
    if (!p) {
      return;
    }

    // If it's not an object, return
    if (p.type != "object") {
      return;
    }

    // Otherwise make sure that there is at least one required field
    if (!p.required || p.required.length < 1) {
      return [
        {
          message: `{{path}} is defined as a required object, but no child fields are required`,
        },
      ];
    }
  }
};
