### SliceMessageBox

Messages handling basic class. Main objective of it is to handles received [SliceMessage](SliceMessage.markdown) either by itself or by its owner [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) or [class](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/class). When provided with [SliceMessenger](SliceMessenger.markdown) can be used to send messages.

#### `constructor(owner = {}, settings = {}, messenger, subscribe)`

[SliceMessageBox](#slicemessagebox) constructor  

###### Arguments

| Name | type | Description |
| --- | --- | --- |
| owner | [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) or [class](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/class) | [SliceMessageBox](#slicemessagebox) owner, depending on `settings` can be used to handle [SliceMessage](SliceMessage.markdown) |
| settings | [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | Object with [SliceMessageBox](#slicemessagebox) settings |
| messenger | [SliceMessenger](SliceMessenger.markdown) | when provided, [SliceMessageBox](#slicemessagebox) can be used to send [SliceMessage](SliceMessage.markdown) |
| subscribe | boolean | When `true`, will add created [SliceMessageBox](#slicemessagebox) to the provided [SliceMessenger](SliceMessenger.markdown) |

###### Example:

```javascript
// create SliceMessenger
const messenger = SliceMessengerFactory.create('myMessenger');
// create message box owner object
const myMessageBoxOwner = {
    ownerMethodDefault: function(message) {
        console.log('ownerMethodDefault' + message.name);
    },
    ownerMethod1: function(message) {
        console.log('ownerMethod1: messageName1);
    },
    ownerMethod2: function(message) {
        console.log('ownerMethod2: messageName2=' + message.data.prop1);
    }
};
// create SliceMessageBox settings
const myMessageBoxSettings = {
    // handlers list, with key as message name and value as handler settings
    handlers: {
        // full handler example
        'messageName1': {
            // defines who should handle message, false - owner will handle, true - message box
            self: false, // boolean
            // method name, that will be called to handle message
            handler: 'ownerMethod1' // string
        },
        // short example, but do the same as full example
        'messageName2': 'ownerMethod2'
    },
    // default handler, same rules as for handler settings
    defaultHandler: {
        // defines who should handle message, false - owner will handle, true - message box
        self: false, // boolean
        // method name, that will be called to handle message
        handler: 'ownerMethodDefault' // string
    }
};
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings, messenger, true);
// send messages to itself
myMessageBox.sendSelf('messageName1'); // will log 'ownerMethod1: messageName1'
myMessageBox.sendSelf('messageName2', {prop1: 'value1'}); // will log 'ownerMethod2: messageName2=value1'
myMessageBox.sendSelf('messageName3'); // will log 'ownerMethodDefault: messageName3'
myMessageBox.sendSelf('unknownMessage'); // will log 'ownerMethodDefault: unknownMessage'
```

#### Properties

| Name | type | Description |
| --- | --- | --- |
| owner | [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) or [class](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/class) | [SliceMessageBox](#slicemessagebox) owner, depending on `settings` can be used to handle [SliceMessage](SliceMessage.markdown). |
| settings | [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | Object with [SliceMessageBox](#slicemessagebox) settings. |
| messenger | [SliceMessenger](SliceMessenger.markdown) | when provided, [SliceMessageBox](#slicemessagebox) can be used to send [SliceMessage](SliceMessage.markdown). |

#### Methods

##### `setMessenger(messenger, subscribe, unsubscribe)`

Set [SliceMessenger](SliceMessenger.markdown), subscribe to it and unsbuscribe from pervious. 

###### Arguments

| Name | type | Description |
| --- | --- | --- |
| messenger | [SliceMessenger](SliceMessenger.markdown) | [SliceMessenger](SliceMessenger.markdown), that will be used to send messages. |
| subscribe | boolean | Add current message box to provided [SliceMessenger](SliceMessenger.markdown) or not. |
| unsubscribe | boolean | Remove current message box from previous [SliceMessenger](SliceMessenger.markdown) if any. |

###### Example:

```javascript
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings);
// create messenger
const messenger1 = SliceMessengerFactory.create('myMessenger1');
// set messenger and subscribe to it
myMessageBox.setMessenger(messenger1, true);
// now it receives messages from messenger1 and can send messages through it
// create another messenger
const messenger2 = SliceMessengerFactory.create('myMessenger2');
// set messenger, but don't subscribe to it, and unsubscribe from messenger1
myMessageBox.setMessenger(messenger2, false, true);
// now it doesn't receive messages from messengers, but can send messages through messenger2
```

##### `receive(message)`

Receive [SliceMessage](SliceMessage.markdown) `message` and handle it, i.e. transmit it to the owner or handle by itself.

###### Example:

```javascript
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings);
// create message
const myMessage = new SliceMessage('message', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
// receive message
myMessageBox.receive(myMessage);
```

##### `send(name, data, timeout)`

Send message throught [SliceMessenger](SliceMessenger.markdown) and is a quirk for [SliceMessenger.send](SliceMessenger.markdown#sendname-data-timeout).  
***If [SliceMessenger](SliceMessenger.markdown) wasn't provided with [constructor](#constructorowner---settings---messenger-subscribe) or [setMessenger](#setMessengermessenger-subscribe-unsubscribe) method, will throw Error "Can't send message: no messenger provided."***

###### Example:

```javascript
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings, messenger);
// create message
myMessageBox.send('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
```

##### `sendSelf(name, data, timeout)`

Send message to the current [SliceMessenger](SliceMessenger.markdown) only, is a quirk for [SliceMessenger.sendSelf](SliceMessenger.markdown#sendselfname-data-timeout).  
***If [SliceMessenger](SliceMessenger.markdown) wasn't provided with [constructor](#constructorowner---settings---messenger-subscribe) or [setMessenger](#setMessengermessenger-subscribe-unsubscribe) method, will throw Error "Can't send message: no messenger provided."***

###### Example:

```javascript
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings, messenger);
// create message
myMessageBox.sendSelf('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
```

##### `sendCurrent(name, data, timeout)`

Send message throught [SliceMessenger](SliceMessenger.markdown) to the current window/frame, is a quirk for [SliceMessenger.sendCurrent](SliceMessenger.markdown#sendcurrentname-data-timeout).  
***If [SliceMessenger](SliceMessenger.markdown) wasn't provided with [constructor](#constructorowner---settings---messenger-subscribe) or [setMessenger](#setMessengermessenger-subscribe-unsubscribe) method, will throw Error "Can't send message: no messenger provided."***

###### Example:

```javascript
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings, messenger);
// create message
myMessageBox.sendCurrent('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
```

##### `sendEveryone(name, data, timeout)`

Send message throught [SliceMessenger](SliceMessenger.markdown) to the current window/frame and outer receivers, is a quirk for [SliceMessenger.sendEveryone](SliceMessenger.markdown#sendeveryonename-data-timeout).  
***If [SliceMessenger](SliceMessenger.markdown) wasn't provided with [constructor](#constructorowner---settings---messenger-subscribe) or [setMessenger](#setMessengermessenger-subscribe-unsubscribe) method, will throw Error "Can't send message: no messenger provided."***

###### Example:

```javascript
// create message box
const myMessageBox = new SliceMessageBox(myMessageBoxOwner, myMessageBoxSettings, messenger);
// create message
myMessageBox.sendEveryone('myMessage', {
    variable1: 'value1',
    variable2: 'value2',
    variableN: 'valueN'
});
```