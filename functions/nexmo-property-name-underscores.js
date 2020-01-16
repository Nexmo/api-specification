// use with "$.paths.*.*.parameters.*"

module.exports = (targetVal) => {
    // more types of data structure will also be passed in here in future
    return test_field(targetVal.name);
}

function test_field(field) {

    // camelcase?
    if (/[A-Z]/.test(field)) {
        return [{message: "All variable names should be lower case (found " + field + ")"}];
    }

    // hypen?
    if (/[-]/.test(field)) {
        return [{message: "Property names must use underscores, not hyphens (found " + field + ")"}];
    }

    // multiple underscores?
    if (field.split("_").length > 2) {
        return [{message: "Property names may not have more than one underscore (found " + field + ")"}];
    }

};
