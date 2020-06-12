# Functions

These functions are for our [spectral](https://github.com/stoplightio/spectral) rules. Please name and describe your function here so we can keep track of what we have.

_this list is empty because we're not using any custom functions yet_

## Object Required Properties

Errors when an object is defined as `required` but no child parameters are defined as `required`

```
 448:11  error  required-object-params  #/components/schemas/File/allOf/1 is defined as a required object, but no child fields are required
```

## Required Property Example

Errors when a property is defined as `required` but does not contain an `example`

```
 481:22  error  required-property-example  #/components/schemas/Template/allOf/1/properties/template/properties/name is defined as a required object and is missing an example
```

## Operation Ordering

Ensures a consistent ordering of verbs within an endpoint: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`

```
 13:17  error  endpoint-verb-order    'get' should be listed before 'post' in #/paths/~1utterances
```
