# API Design Guidelines

- [Names and Formats](#names-and-formats)
- [Response Structure](#response-structure)
- [Behaviour](#behaviour)
- [API Spec](#api-spec)
- [Versioning](#versioning)

Names and Formats
-----------------

### Convention
- Have parameters / properties in lower case with underscores. 
- Have identifiers following the format: type_id. (message_id, recording_id, etc)
- Use distinguishers only when the name is non-intuitive or conflicts with another name. (`count` instead of `message_count` because message should be intuitive, but `carrier_network` if there's also a roaming network)
- Limit parameter / property names to a single underscore.
- Reuse parameter / property names. (`from` instead of `msisdn`)

#### Examples
- `machine_detection`
- `call_id`
- `conference_id`

### Objects retrieved via webhooks by the API (*Discussion Required*)
Objects retrieved via webhooks by the API are in camelCase. 

#### For example:
Nexmo Call Control Objects (NCCO) examples:
- `eventUrl`
- `musicOnHold`
- `beepOnStart`

### Decimal precision
All values returned by Nexmo shall have the same decimal precision. Suggested is 4 decimal point to match pricing. For example: `credit-limit: "0.0000"`.

### Generic Naming
The following parameters are included for all APIs:

#### `identifier`
	
A string that identifies a specific communication device or endpoint. Can be an:
- E.164 number
- sip address 
- The UUID of a web rtc client
- ...

An API may restrict which types of identifiers are accepted. For example, Number Insight will only accept an E.164 number for the 'identifier' parameter.

#### `to`

The identifier of a message or conversation recipient. This represents either:
  - The app sending an outbound message 
  - The user contacting the app with an inbound messages

#### `from`	

The identifier of a message sender or the initiator of a conversation. This represents either:
- The app sending an outbound message 
- The user contacting the app with an inbound messages

#### `reference`

The reference associating this request with the customer's internal data systems.

#### `<description>_url`

A url that is necessary for communication. For example, `callback_url`.

#### `<description>_method`

send the callback using either GET or POST.

#### `ttl`

Total time to live is the time during which this request is valid.

#### `<description>_id`

The unique identifier assigned by Nexmo for your request.

#### `mccmnc`

the country and carrier code for the carrier who handled your request.

#### `language`

The language used for the communication in https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes. For example, en-US.

#### `count`

The number of parts your message was divided into in order to be sent correctly.

#### `total` 

The amount of objects found as a result of a search request.

#### `direction`

Set to true if the communication is inbound.

#### `start`

The time the communication started in https://en.wikipedia.org/wiki/ISO_8601 format.

#### `end`

The time the communication ended in https://en.wikipedia.org/wiki/ISO_8601 format.

#### `duration`

The duration of the call in seconds.

#### `index`

The index of this message in relation to count.

#### `balance`

The amount of money left in your Nexmo account.
 
#### `rate`

The price for each request. This is per request for text based messages, or per second for voice.

#### `cost`

The total cost that is the result of the request. 


Response Structure
---------------
### Data Structure
- Each API defines a single data structure and set of properties (resource). This must be coherent with the other APIs.
- The data structure must be uniform regardless of the context. An SMS record is always the same, a number is always the same.
- Data structures can be used as properties of other responses.
- In each context properties that are always unknown may be omitted. For example: a request to sending an SMS never contains DLR data.
- Properties that are potentially unknown should be included, but without a value. For example, if the Cloud Communications Platform cannot call the phone number defined in a request from Call API, the return properties will not have a valid `call_start` and `call_end`.

#### Example Response 
(common data structure for 'number')

```json
{
    "call_id": "abcd1234",
    "start_time": "123456789",
    "end_time": "123456799",
    "to": {
        "type": "e.164",
        "address": "+14445556767"
    },
    "from": {
        "type": "sip",
        "address": "user@example.com"
    }
}
```

### HTTP Status Codes
API must express the general status of the request using HTTP status codes. Specific errors can be expressed in the response body.

#### Success: 2XX

##### 200: OK
Generic, and used when no more specific code is relevant. For example: `GET /plots/p123`, or `PUT /plots/p123?overthrow=true`

##### 201: Created	
Used when a new resource has been created. Should (per HTTP spec) contain a `Location` header with the URI for the created resource. Avoiding any body here forces the client to only ever get the resource data from the URI.
For example: `POST /plots?overthrow=true&date=tomorrow` => `Location: /plots/p124`

##### 202: Accepted	
Acknowledges the request has been received, but not that the process has been completed. Used for asynchronous tasks. Response body should include some kind of status, and a way to poll for status.
Should avoid this in favor of creating a 'workflow' resource for anything complex.

#### 204: No Content
Generally used on a successful DELETE. As the resource has been deleted there is no body.

#### Client errors: 4XX

##### 400: Bad Request	
Generic, like a 200 used in most cases when the request is incorrect and no more specific code applies. More details should be available (specific error, and human description) in the response body.

##### 401: Unauthorized	
Request is missing API authorization credentials, or those credentials are invalid.

##### 403: Forbidden
The authenticated user can not make this request. This is not an authentication issue, this is an authorization issue (could be due to low balance, scope of the auth token used, etc).

##### 404: Not Found	
The resource could not be found. If the URI format is correct with the exception of the resource ID, the body should include the same structured error response as any other API error.
For example: `GET /plans/p125`

##### 409: Conflict
The request could not be completed due to a conflict with the current state of the resource. The resource exists; however, the action could not be taken. The response MUST contain contain a description of the conflict.
For example: `PUT /calls/123/talk`

##### 410: Gone
The requested resource is no longer available at the server. This condition is expected to be considered permanent. Used when the URI is formatted correctly, but the subresource is no long available.
For example: `PUT /calls/123/talk`

##### 429: Too Many Requests
Not in the official spec (rather a part of RFC 6585), response used when request is rate-limited. Used enough to be well understood.

#### Server Errors(5XX)	

##### 500: Internal Server Error
Generic, like a 200 used in most cases when no more specific code applies. More details should be available (specific error, and human description) in the response body.

### Error Messages
Any non 200 response body should follow a standard format. This should be consistent for all products, as an error may be product specific (invalid parameters) or global in nature (invalid authorization). The [HTTP Problem draft][http_problem], specifically the [JSON Object][http-problem-object] provide a familiar format used by other APIs that provides a set of standard properties while allowing additional properties when needed for a particular error condition.

Stealing the the examples from the draft:
```
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json
Content-Language: en
{
    "type": "https://example.com/Error#out-of-credit",
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "balance": 30,
    "accounts": ["/account/12345",
                 "/account/67890"]
}
```
``` 
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
Content-Language: en
{
   "type": "https://example.net/validation-error",
   "title": "Your request parameters didn't validate.",
   "invalid_parameters": [ {
                         "name": "age",
                         "reason": "must be a positive integer"
                       },
                       {
                         "name": "color",
                         "reason": "must be 'green', 'red' or 'blue'"}
                     ]
}
```

Following REST patterns, `type` is both the identifier for the specific error (URI) and a link to human readable documentation about the problem.
`type`, `title`, `status`, `detail`, and `instance` [are the standard properties][http-problem-properties], as the example shows additional properties can be added if relevant to the error.
Note that this means a single response can not contain both a success and a failure (or even two failures that are significant enough to require two different high level problems).

### Collection and Links
- [HAL-JSON][hal] provides a consistent format supported by consumer and provider tooling. [Current Draft][hal-draft]
- Allows resources to be embedded using an `_embedded` property (with a distinguishing key).
- Collections are simply resources that embed a set of resources of the same type.
- Collections are not limited to a fixed set of properties (can create collection specific properties like 'queuedCalls' to provide a count of a subset).
- Related resources will be referenced under a `_links` property.
- There will always be a `_links.self` to the current resource.
- Paging will use `_links`.


Behavior
--------
- Updating resources will fail if required parameters are not set.
- Unsent optional parameters will not be overwritten with default values.
- Response for a POST or GET will be the same resource.
- All APIs that allow updating a resource will also allow fetching a resource.

### REST
All new API's shall adhere to the principles of REST (http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). In doing so the following shall apply:

- Separate things into logical Collections e.g. members
- Collections are the collective term for Resources e.g. member
- Resources are nouns not verbs
- Collections are plurals
- Use HTTP methods to map CRUD actions on Resources i.e. POST creates a new Resources in a Collection, DELETE removes a Resource, GET lists Resources and PUT changes a Resource

#### Examples
- `GET members/` - lists all the resources of the collection members
- `GET members/bob` - lists the details of bob who is a resources of the collection members
- `POST members/harry` - create a new member called Harry
- `PUT members/harry/phone` - update Harry's phone number
- `DELETE members/steve` - remove the member Steve from the collection

### Pagination
- There shall be a way to page through collections without additional filters.
- There shall be a way to page through collections with filters.
- Paging shall use a standard set of hal+json `_links`
  - `self` (current page, required)
  - `next` (next page, optional)
  - `prev` (previous page, optional)
  - `first` (first page, required)
  - `last` (last page, required)
- Paging `_links` will include filters.


API specs
---------
Every API shall be described using the [OpenAPI Specification][oai].


Versioning
----------
Nexmo APIs will support versioning. The version is given in the URI. The format for versioning is `HOST/VERSION/API` e.g. `api.nexmo.com/v1/calls` or `api.nexmo.com/v3/media`

### Deprecation
When the decision has been taken to deprecate an API:
- There will be a 1 year grace period between the announcement and the moment when API is deactivated. 
- Warning emails will be sent to the API at regular intervals before the deprecation time
- A guide will be supplied to customers explaining how to migrate to the replacement API with the initial deprecation notice. 


[hal]: http://stateless.co/hal_specification.html
[hal-draft]: https://tools.ietf.org/html/draft-kelly-json-hal-07
[oai]: https://github.com/OAI/OpenAPI-Specification
[http-problem-properties]: https://tools.ietf.org/html/draft-ietf-appsawg-http-problem-02#section-3.1
[http-problem]: https://tools.ietf.org/html/draft-ietf-appsawg-http-problem-02
[http-problem-object]: https://tools.ietf.org/html/draft-ietf-appsawg-http-problem-02#section-3
