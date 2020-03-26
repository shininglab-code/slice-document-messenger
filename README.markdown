Slice Document Messenger
-------

JavaScript library to send, receive, handle messages from-to iframe, browser tab, browser window.
Uses [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) to transport messages.

#### Examples

[https://shininglab-code.com/slice-document-messenger/](https://shininglab-code.com/slice-document-messenger/)

## Classes

| Class | Extends | Description |
| --- | --- | --- |
| [SliceMessage](docs/SliceMessage.markdown) | none | Message class, stores message name and data. The one that is transportend. |
[SliceMessageTransport](docs/SliceMessageTransport.markdown) | none | Messages transport basic class. Contains basic functionality to send and receive [SliceMessage](docs/SliceMessage.markdown).
| [SliceLocalStorageTransport](docs/SliceLocalStorageTransport.markdown) | [SliceMessageTransport](docs/SliceMessageTransport.markdown) | Message transport that uses [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) to transport messages. |
| [SliceMessenger](docs/SliceMessenger.markdown) | none | Use it to send [SliceMessage](docs/SliceMessage.markdown) throught [SliceMessageTransport](docs/SliceMessageTransport.markdown) and distribute it to its recievers, either [SliceMessageBox](docs/SliceMessageBox.markdown) or [function](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions). |
| [SliceMessageBox](docs/SliceMessageBox.markdown) | none | Messages handling basic class. Main objective of it is to handle received [SliceMessage](docs/SliceMessage.markdown) either by itself or by its owner [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) or [class](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/class). When provided with [SliceMessenger](docs/SliceMessenger.markdown) can be used to send messages. |
| [SliceMessengerFactory](docs/SliceMessengerFactory.markdown) | none | Static class that is used to create [SliceMessenger](docs/SliceMessenger.markdown). |

## License

[MIT](LICENSE)