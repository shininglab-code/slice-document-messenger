### SliceMessengerFactory

Static class that is used to create [SliceMessenger](SliceMessenger.markdown).

#### Static properties

| Name | type | Description |
| --- | --- | --- |
| transports | Array | Array of available [SliceMessageTransport](SliceMessageTransport.markdown) transports |

#### Static methods

##### `addTransport(transport)`

Add [SliceMessageTransport](SliceMessageTransport.markdown) `transport` to the array of available `transports`
***It's important to add atleast one [SliceMessageTransport](SliceMessageTransport.markdown) `transport`, so it will be possible to create [SliceMessenger](SliceMessenger.markdown) `messengers`***

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// add transport
SliceMessengerFactory.addTransport(transport);
```

##### `static getIdFromURL(searchURL)`

Get _messengerId_ from get parameters of `searchURL`.

###### Example:

```javascript
const messengerId = SliceMessengerFactory.getIdFromURL('https://frame.html?messengerId=my-messenger-id');
console.log(messengerId); // will log 'my-messenger-id'
```

##### `static getAvailableTransport()`

Get first available [SliceMessageTransport](SliceMessageTransport.markdown) `transport` from array of [transports](#static-properties).

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// add transport
SliceMessengerFactory.addTransport(transport);
// get available transport
const availableTransport = SliceMessengerFactory.getAvailableTransport();
```

##### `static createMessenger(id = SliceMessengerFactory.getIdFromURL(location.search), transport = SliceMessengerFactory.getAvailableTransport())`

Create [SliceMessenger](SliceMessenger.markdown) `messenger` with provided `id` and [SliceMessageTransport](SliceMessageTransport.markdown) `transport`.

1. If `id` is not provided, will try to get id from current page URL with [SliceMessengerFactory.getIdFromURL](#static-getidfromurlsearchurl).
1. If `transport` is not provided, will try to get available `transport` with [SliceMessengerFactory.getAvailableTransport](#static-getavailabletransport).

###### Example:

```javascript
// create SliceLocalStorageTransport
const myTransport = new SliceLocalStorageTransport();
// add transport
SliceMessengerFactory.addTransport(myTransport);
/**
 * Create messenger with no arguments.
 * Will get id from current page URL messengerId get parameter.
 * Will get available transport from array of SliceMessengerFactory transports.
 * Beware cause it can throw errors:
 * if there is no 'messengerId' in get parameters,
 * if no transport available.
 */
const messenger = SliceMessengerFactory.createMessenger();
/**
 * Create messenger with 'myMessenger' id.
 * Will get available transport from array of SliceMessengerFactory transports.
 * Beware cause it can throw errors:
 * if there is no transport available.
 */
const messenger = SliceMessengerFactory.createMessenger('myMessenger');
// create messenger with 'myMessenger' id and myTransport transport
const messenger = SliceMessengerFactory.createMessenger('myMessenger', myTransport);
```