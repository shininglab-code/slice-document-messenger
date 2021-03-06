### SliceMessageTransport

Messages transport basic class. Contains basic functionality to send and receive [SliceMessage](SliceMessage.markdown).  
***Shouldn't be used as standalone, and should be used to create transport classes***

#### `constructor()`

[SliceMessageTransport](#slicemessagetransport) constructor.  

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
```

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| receivers | object | List of receivers arrays, i.e. `{'myAddress': [recieverFn1, recieverFn2,recieverFnN]}` |

#### Methods

##### `isAvailable()`

Check if transport is available.  
Returns `true` if transport is available and [SliceMessage](SliceMessage.markdown) can be sent and received.  
Returns `false` if transport is unavailable. 

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
const myTransportIsAvailable = myTransport.isAvailable(); // true|false
```

##### `addReceiver(address, receiver)`

Add [SliceMessage](SliceMessage.markdown) receiver.  
`address` will be taken to filter messages.  
`receiver` should be a [function](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions) that will be called when transport receives message with such `address`, and should have 1 argument that will take received [SliceMessage](SliceMessage.markdown).

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
myTransport.addReceiver('myAddress', function(message) {
    // message is an instance of SliceMessage
    console.log(message.name, message.data);
});
```

##### `removeReceiver(address, receiver)`

Remove [SliceMessage](SliceMessage.markdown) receiver.  
`address` receiver address.  
`receiver` receiver [function](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions).

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
// create and add receiver
const receiver = function(message) {
    // message is an instance of SliceMessage
    console.log(message.name, message.data);
};
myTransport.addReceiver('myAddress', receiver);
// and now remove
myTransport.removeReceiver('myAddress', receiver);
```

##### `hasAddress(address, isTransport)`

Check if there is receivers with such `address`.  
`isTransport` can be set to `true` if `address` is transport address.

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
// create and add receiver
const receiver = function(message) {
    // message is an instance of SliceMessage
    console.log(message.name, message.data);
};
myTransport.addReceiver('myAddress', receiver);
// check if has addresses
console.log(myTransport.hasAddress('myAddress')); // true
console.log(myTransport.hasAddress('myAddress'), true); // false
console.log(myTransport.hasAddress('notAddress')); // false
// get transport address
const transportAddress = SliceMessageTransport.getAddress('myAddress');
console.log(myTransport.hasAddress(transportAddress), true); // true
```

##### `receive(address, message, isTransport)`

Receive [SliceMessage](SliceMessage.markdown) `message` and transmit it to receivers with such `address`.  
`isTransport` can be set to `true` if `address` is transport address.

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
// create and add receiver
const receiver = function(message) {
    // message is an instance of SliceMessage
    console.log(message);
};
myTransport.addReceiver('myAddress', receiver);
// create message
const myMessage = new SliceMessage('myMessageName', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// receive messages
myTransport.receive('myAddress', myMessage); // will log myMessage object
myTransport.receive('myAddress', myMessage, true); // do nothing as there is no such receiver
// get transport address
const transportAddress = SliceMessageTransport.getAddress('myAddress');
myTransport.receive(transportAddress, myMessage, true); // will log myMessage object
```

##### `send(address, message)`

Basic method to send [SliceMessage](SliceMessage.markdown).  
Logs arguments to console.

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
// create message
const myMessage = new SliceMessage('message', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// send message
myTransport.send('receiverAddress', myMessage);
```

##### `remove()`

Remove current transport: cleanup receivers, etc.

###### Example:

```javascript
const myTransport = new SliceLocalStorageTransport();
// remove
myTransport.remove();
```

#### Static methods

##### `static getAddress(address)`

Get transport address.  
This address is the one that is used to transport [SliceMessage](SliceMessage.markdown).

###### Example:

```javascript
const transportAddress = SliceMessageTransport.getAddress('myAddress');
```

##### `static isAvailable()`

Check if transport type is available.

###### Example:
```javascript
const isAvailable = SliceMessageTransport.getAddress(); // true|false
```