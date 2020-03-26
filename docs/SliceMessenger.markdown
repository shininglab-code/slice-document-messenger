### SliceMessenger

Use it to send [SliceMessage](SliceMessage.markdown) throught [SliceMessageTransport](SliceMessageTransport.markdown) and distribute it to its receivers, either [SliceMessageBox](SliceMessageBox.markdown) or [function](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions).

#### `constructor(id, transport)`

[SliceMessenger](#slicemessenger) constructor  

###### Arguments

| Name | type | Description |
| --- | --- | --- |
| id | string | Messenger id, used as `address` for transport. |
| transport | [SliceMessageTransport](SliceMessageTransport.markdown) | [SliceMessageTransport](SliceMessageTransport.markdown) to send and receve messages. |

***If `id` is not provided throws Error "Can't create messenger without id."***  
***If `transport` is not instance of [SliceMessageTransport](SliceMessageTransport.markdown) throws TypeError "Messenger transport should be instance of SliceMessageTransport."***

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
```

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| id | string | Messenger id, that is used as its `address` for [SliceMessageTransport](SliceMessageTransport.markdown). |
| timeouts | object | List of arrays with pending messages timeouts, with message names as keys. |
| receivers | object | List of arrays with receivers, with message names as keys. |
| boxes | Array | Array of [SliceMessageBox](SliceMessageBox.markdown). |
| transport | [SliceMessageTransport](SliceMessageTransport.markdown) | [SliceMessageTransport](SliceMessageTransport.markdown) that is used to send and receive messages. |

#### Methods

##### `receive(message)`

Receive [SliceMessage](SliceMessage.markdown) `message` and handle it.
1. Transmit [SliceMessage](SliceMessage.markdown) `message` to all [SliceMessageBox](SliceMessageBox.markdown) `boxes`
2. Filter receivers [functions](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions) by `message.name` and transmit [SliceMessage](SliceMessage.markdown) `message` to it

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// add receiver
messenger.addReceiver('myMessage', function(message) {
    console.log('Received: ' + message.name);
});
// create message
const message = new SliceMessage('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// receive message
messenger.receive(message); // will log 'Received: myMessage'
```

##### `send(name, data, timeout)`

Create [SliceMessage](SliceMessage.markdown) with provided `name` and `data`, and send it to an outer receivers.  
`timeout` can be set to delay message sending, but it won't send message if there will be sent another message with same name while delay lasts.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// send message with just name
messenger.send('myMessage');
// send message with just name and data
messenger.send('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// this message won't be sent
messenger.send('myDelayedMessage', { value: "this message won't be sent" }, 1000);
// this will override 'myDelayedMessage' and will be sent after 1000ms~1s
messenger.send('myDelayedMessage', { value: "send this instead" }, 1000);
```

##### `sendSelf(name, data, timeout)`

Create [SliceMessage](SliceMessage.markdown) with provided `name` and `data`, and send it to the current messenger only.  
`timeout` can be set to delay message sending, but it won't send message if there will be sent another message with same name while delay lasts.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// send message with just name
messenger.sendSelf('myMessage');
// send message with just name and data
messenger.sendSelf('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// this message won't be sent
messenger.sendSelf('myDelayedMessage', { value: "this message won't be sent" }, 1000);
// this will override 'myDelayedMessage' and will be sent after 1000ms~1s
messenger.sendSelf('myDelayedMessage', { value: "send this instead" }, 1000);
```

##### `sendCurrent(name, data, timeout)`

Create [SliceMessage](SliceMessage.markdown) with provided `name` and `data`, and send it to the current window/frame.  
`timeout` can be set to delay message sending, but it won't send message if there will be sent another message with same name while delay lasts.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// send message with just name
messenger.sendCurrent('myMessage');
// send message with just name and data
messenger.sendCurrent('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// this message won't be sent
messenger.sendCurrent('myDelayedMessage', { value: "this message won't be sent" }, 1000);
// this will override 'myDelayedMessage' and will be sent after 1000ms~1s
messenger.sendCurrent('myDelayedMessage', { value: "send this instead" }, 1000);
```

##### `sendEveryone(name, data, timeout)`

Create [SliceMessage](SliceMessage.markdown) with provided `name` and `data`, and send it to the current window/frame and outer receivers.  
`timeout` can be set to delay message sending, but it won't send message if there will be sent another message with same name while delay lasts.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// send message with just name
messenger.sendEveryone('myMessage');
// send message with just name and data
messenger.sendEveryone('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// this message won't be sent
messenger.sendEveryone('myDelayedMessage', { value: "this message won't be sent" }, 1000);
// this will override 'myDelayedMessage' and will be sent after 1000ms~1s
messenger.sendEveryone('myDelayedMessage', { value: "send this instead" }, 1000);
```

##### `addBox(box)`

Add/subscribe [SliceMessageBox](SliceMessageBox.markdown) `box` to current messenger.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// create SliceMessageBox
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings);
// add messenger box
messenger.addBox(myMessageBox);
```

##### `removeBox(box)`

Remove/unsubscribe [SliceMessageBox](SliceMessageBox.markdown) `box` from current messenger.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// create SliceMessageBox
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings);
// add messenger box
messenger.addBox(myMessageBox);
// remove messenger box
messenger.removeBox(myMessageBox);
```

##### `addReceiver(name, receiver)`

Add `receiver` [function](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions).  
`name` - message name to filter [SliceMessage](SliceMessage.markdown) `messages` that should be received by `receiver`.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// create SliceMessageBox
const myReceiver = function(message) {
    console.log('Received: ' + message);
};
// add receiver
messenger.addReceiver('myMessage', myReceiver);
```

##### `removeReceiver(name, receiver)`

Remove `receiver` [function](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions).  
`name` - message name to remove `receiver` from.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// create SliceMessageBox
const myReceiver = function(message) {
    console.log('Received: ' + message);
};
// add receiver to 'notMyMessage' messages
messenger.addReceiver('notMyMessage', myReceiver);
// add receiver to 'myMessage' messages
messenger.addReceiver('myMessage', myReceiver);
// remove receiver from 'notMyMessage'
messenger.removeReceiver('notMyMessage', myReceiver);
// in the end myReceiver will still receive 'myMessage' messages, and won't receive 'notMyMessage' messages
```

##### `remove()`

Remove current messenger: cleanup timeouts, stop receiving `messages` from `transport`.

###### Example:

```javascript
// create SliceLocalStorageTransport
const transport = new SliceLocalStorageTransport();
// create SliceMessenger
const messenger = new SliceMessenger('myMessenger', transport);
// remove messenger
messenger.remove()
```