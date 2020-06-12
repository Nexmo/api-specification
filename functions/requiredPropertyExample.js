module.exports = function (targetValue, options, paths, otherValues) {
  if (!targetValue.required) {
    return;
  }

  for (let field of targetValue.required) {
    const p = targetValue.properties[field];

    // Sometimes we can't resolve the field if it uses allOf
    // Let's not error there
    if (!p) {
      return;
    }

    // Otherwise make sure that there is at least one required field
    if (p.example === undefined) {
      // But not if it's an object. If it's an object we delegate to the child properties
      if (p.type == "object" && p.properties) {
        return;
      }

      // And the same if it's an array of objects or a oneOf (which we assume are objects)
      if (p.type == "array" && (p.items.type == "object" || p.items.oneOf)) {
        return;
      }

      return [
        {
          message: `{{path}}/properties/${field} is defined as a required object and is missing an example`,
        },
      ];
    }
  }
};
